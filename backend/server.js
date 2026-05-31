const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractTextFromFile } = require('./parser');
const { scoreResume } = require('./scorer');

const app = express();
const PORT = process.env.PORT || 5005;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directory exists inside workspace
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${ext}. Supported types: PDF, DOC, DOCX, TXT.`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

// In-Memory Database store for screened candidates
let candidateStore = [];
let activeJobDescription = '';

// Check server status
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

/**
 * Endpoint to upload resumes and JD, then analyze and score them
 * Expected fields:
 * - resumes: [File(s)]
 * - jobDescriptionText: [String] (Manual input)
 * - jobDescriptionFile: [File] (Optional uploaded file)
 */
app.post('/api/screen', upload.fields([
  { name: 'resumes', maxCount: 20 },
  { name: 'jobDescriptionFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const resumeFiles = req.files['resumes'];
    const jdFile = req.files['jobDescriptionFile'] ? req.files['jobDescriptionFile'][0] : null;
    let jdText = req.body.jobDescriptionText || '';

    if (!resumeFiles || resumeFiles.length === 0) {
      return res.status(400).json({ error: 'Please upload at least one resume.' });
    }

    // Extract Job Description if a document is uploaded
    if (jdFile) {
      try {
        const parsedJD = await extractTextFromFile(jdFile.path);
        if (parsedJD && parsedJD.trim().length > 10) {
          jdText = parsedJD;
        }
        // Cleanup JD file
        fs.unlinkSync(jdFile.path);
      } catch (err) {
        console.error('Failed to parse Job Description document:', err);
        return res.status(400).json({ error: 'Failed to read uploaded Job Description file: ' + err.message });
      }
    }

    if (!jdText || jdText.trim().length < 15) {
      return res.status(400).json({ error: 'Please enter a valid Job Description of at least 15 characters.' });
    }

    activeJobDescription = jdText;
    const results = [];
    const errors = [];

    // Parse and score each uploaded resume
    for (const file of resumeFiles) {
      try {
        const text = await extractTextFromFile(file.path);
        
        if (!text || text.trim().length < 50) {
          throw new Error('Resume text is too brief or empty. Check if file is scanned/non-selectable.');
        }

        const scoring = scoreResume(text, jdText, file.originalname);
        
        // Add random id and default status
        const candidateId = 'cand_' + Math.random().toString(36).substr(2, 9);
        const result = {
          id: candidateId,
          status: 'Screened', // Default recruitment pipeline status
          notes: '',
          dateAdded: new Date().toLocaleDateString(),
          ...scoring,
          tempPath: file.path // Keep track of uploaded path
        };

        results.push(result);
      } catch (err) {
        console.error(`Error screening resume ${file.originalname}:`, err);
        errors.push({
          fileName: file.originalname,
          error: err.message
        });
        
        // Delete physical file on error
        try {
          fs.unlinkSync(file.path);
        } catch (e) {}
      }
    }

    if (results.length === 0) {
      return res.status(422).json({
        error: 'All uploaded resumes failed to parse.',
        details: errors
      });
    }

    // Sort candidates by match score from highest to lowest
    results.sort((a, b) => b.score - a.score);

    // Apply ranking number
    results.forEach((cand, idx) => {
      cand.rank = idx + 1;
    });

    // Save to our in-memory storage
    candidateStore = results;

    res.status(200).json({
      message: `Successfully screened ${results.length} candidates.`,
      candidates: candidateStore,
      errors: errors.length > 0 ? errors : null
    });

  } catch (globalError) {
    console.error('Global screening crash:', globalError);
    res.status(500).json({ error: 'Internal server error during processing: ' + globalError.message });
  }
});

// Fetch currently analyzed candidates
app.get('/api/candidates', (req, res) => {
  res.json({
    candidates: candidateStore,
    jobDescription: activeJobDescription
  });
});

// Update candidate selection status or notes
app.patch('/api/candidates/:id', (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const candidate = candidateStore.find(c => c.id === id);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found.' });
  }

  if (status) {
    const validStatuses = ['Screened', 'Shortlisted', 'Interviewing', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid candidate status.' });
    }
    candidate.status = status;
  }

  if (notes !== undefined) {
    candidate.notes = notes;
  }

  res.json({ message: 'Candidate updated successfully.', candidate });
});

// Reset the current screening dashboard
app.post('/api/reset', (req, res) => {
  // Clean up uploaded resume files
  candidateStore.forEach(cand => {
    try {
      if (fs.existsSync(cand.tempPath)) {
        fs.unlinkSync(cand.tempPath);
      }
    } catch (e) {}
  });

  candidateStore = [];
  activeJobDescription = '';
  res.json({ message: 'Dashboard reset completed.' });
});

// Export ranking results as CSV
app.get('/api/export', (req, res) => {
  if (candidateStore.length === 0) {
    return res.status(400).send('No candidate data available to export.');
  }

  // Create CSV Header
  const headers = [
    'Rank',
    'Candidate Name',
    'Match Score (%)',
    'Status',
    'Skills Score',
    'Experience Score',
    'Education Score',
    'Similarity Score',
    'Years of Experience',
    'Education Level',
    'Matching Skills',
    'Missing Skills',
    'Original File Name'
  ];

  let csvContent = headers.join(',') + '\n';

  candidateStore.forEach(c => {
    const row = [
      c.rank,
      `"${c.candidateName.replace(/"/g, '""')}"`,
      c.score,
      c.status,
      c.matchBreakdown.skillsScore,
      c.matchBreakdown.experienceScore,
      c.matchBreakdown.educationScore,
      c.matchBreakdown.keywordSimilarity,
      c.experienceYears,
      `"${c.education.replace(/"/g, '""')}"`,
      `"${c.matchingSkills.join(', ').replace(/"/g, '""')}"`,
      `"${c.missingSkills.join(', ').replace(/"/g, '""')}"`,
      `"${c.fileName.replace(/"/g, '""')}"`
    ];
    csvContent += row.join(',') + '\n';
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=candidate_ranking_results.csv');
  res.status(200).send(csvContent);
});

// Cleanup hook on shutdown to delete files
process.on('SIGINT', () => {
  console.log('Cleaning up uploaded resumes before shutting down Express server...');
  candidateStore.forEach(cand => {
    try {
      if (fs.existsSync(cand.tempPath)) {
        fs.unlinkSync(cand.tempPath);
      }
    } catch (e) {}
  });
  process.exit();
});

app.listen(PORT, () => {
  console.log(`Express Resume Screening Server running on http://localhost:${PORT}`);
});
