/**
 * Smart Scoring and NLP Screening Engine
 */

// A comprehensive dictionary of standard professional skills across multiple industries.
const TECH_SKILLS_LIBRARY = [
  // Programming Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'golang', 'rust', 'swift', 'kotlin', 'php', 'html', 'css', 'sass', 'sql', 'nosql', 'r', 'scala', 'shell', 'bash',
  // Frontend
  'react', 'react.js', 'reactjs', 'vue', 'vue.js', 'angular', 'svelte', 'next.js', 'nextjs', 'nuxt', 'redux', 'context api', 'tailwind', 'bootstrap', 'webpack', 'vite', 'sass', 'less',
  // Backend & Databases
  'node', 'node.js', 'nodejs', 'express', 'express.js', 'nest', 'nestjs', 'django', 'flask', 'fastapi', 'spring', 'springboot', 'rails', 'laravel', 'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'graphql', 'rest api', 'restful', 'apis', 'mariadb', 'cassandra', 'dynamodb',
  // DevOps & Cloud
  'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'ci/cd', 'jenkins', 'github actions', 'gitlab', 'terraform', 'ansible', 'linux', 'nginx', 'apache',
  // Data Science & AI
  'machine learning', 'ml', 'deep learning', 'dl', 'artificial intelligence', 'ai', 'nlp', 'natural language processing', 'computer vision', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'keras', 'data analysis', 'data visualization', 'tableau', 'power bi',
  // Mobile & Desktop
  'flutter', 'react native', 'electron', 'xamarin', 'ionic',
  // General & Soft Skills / Methodologies
  'agile', 'scrum', 'kanban', 'project management', 'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'testing', 'jest', 'cypress', 'mocha', 'chai', 'tdd', 'ci-cd', 'microservices', 'system design', 'rest', 'soap', 'socket.io', 'websocket', 'figma', 'ui/ux', 'product management', 'leadership', 'communication', 'problem solving', 'teamwork'
];

const STOPWORDS = new Set([
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves',
  'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their',
  'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
  'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about',
  'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up',
  'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
  'should', 'now'
]);

/**
 * Normalizes text by lowercasing, removing punctuation, and trimming.
 * @param {string} text 
 * @returns {string}
 */
function cleanText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s\+\-\#]/g, ' ') // Preserve C++, C#, F#
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenizes text and removes common stopwords.
 * @param {string} text 
 * @returns {string[]}
 */
function tokenize(text) {
  const cleaned = cleanText(text);
  return cleaned
    .split(' ')
    .filter(word => word.length > 1 && !STOPWORDS.has(word));
}

/**
 * Extracts professional skills from a text block based on our catalog.
 * @param {string} text 
 * @returns {string[]}
 */
function extractSkills(text) {
  const cleaned = ` ${cleanText(text)} `; // Wrap with spaces to prevent partial matches
  const matched = [];

  for (const skill of TECH_SKILLS_LIBRARY) {
    // Escape special characters for regex (e.g. c++, c#, next.js)
    const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Match word boundaries or start/end spaces
    const regex = new RegExp(`(?:\\b|\\s)${escapedSkill}(?:\\b|\\s)`, 'i');
    if (regex.test(cleaned)) {
      // Map to standard presentation name
      matched.push(capitalizeSkillName(skill));
    }
  }

  return [...new Set(matched)];
}

/**
 * Formats skill names beautifully.
 */
function capitalizeSkillName(skill) {
  const mapping = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'c++': 'C++',
    'c#': 'C#',
    'golang': 'Go',
    'go': 'Go',
    'rust': 'Rust',
    'html': 'HTML',
    'css': 'CSS',
    'sql': 'SQL',
    'nosql': 'NoSQL',
    'react': 'React',
    'react.js': 'React.js',
    'reactjs': 'React',
    'vue': 'Vue.js',
    'vue.js': 'Vue.js',
    'angular': 'Angular',
    'svelte': 'Svelte',
    'next.js': 'Next.js',
    'nextjs': 'Next.js',
    'redux': 'Redux',
    'tailwind': 'Tailwind CSS',
    'bootstrap': 'Bootstrap',
    'webpack': 'Webpack',
    'vite': 'Vite',
    'node': 'Node.js',
    'node.js': 'Node.js',
    'nodejs': 'Node.js',
    'express': 'Express',
    'express.js': 'Express',
    'nestjs': 'NestJS',
    'fastapi': 'FastAPI',
    'springboot': 'Spring Boot',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'postgres': 'PostgreSQL',
    'mysql': 'MySQL',
    'sqlite': 'SQLite',
    'redis': 'Redis',
    'graphql': 'GraphQL',
    'rest api': 'REST API',
    'apis': 'APIs',
    'aws': 'AWS',
    'gcp': 'Google Cloud (GCP)',
    'azure': 'Azure',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'k8s': 'Kubernetes',
    'ci/cd': 'CI/CD',
    'jenkins': 'Jenkins',
    'terraform': 'Terraform',
    'linux': 'Linux',
    'machine learning': 'Machine Learning',
    'ml': 'Machine Learning',
    'deep learning': 'Deep Learning',
    'dl': 'Deep Learning',
    'artificial intelligence': 'AI',
    'ai': 'AI',
    'nlp': 'NLP (Natural Language Processing)',
    'git': 'Git',
    'github': 'GitHub',
    'jira': 'Jira',
    'figma': 'Figma',
    'ui/ux': 'UI/UX Design',
    'agile': 'Agile Methodologies',
    'scrum': 'Scrum'
  };

  return mapping[skill.toLowerCase()] || skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Calculates cosine similarity between two texts.
 * Represents "Keyword Similarity" on a 0-100 scale.
 */
function calculateCosineSimilarity(text1, text2) {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  // Create word frequencies
  const freq1 = {};
  const freq2 = {};
  const allWords = new Set();

  tokens1.forEach(w => { freq1[w] = (freq1[w] || 0) + 1; allWords.add(w); });
  tokens2.forEach(w => { freq2[w] = (freq2[w] || 0) + 1; allWords.add(w); });

  // Calculate dot product and vectors magnitude
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const word of allWords) {
    const v1 = freq1[word] || 0;
    const v2 = freq2[word] || 0;
    dotProduct += v1 * v2;
    magnitude1 += v1 * v1;
    magnitude2 += v2 * v2;
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  const similarity = dotProduct / (magnitude1 * magnitude2);
  return Math.round(similarity * 100);
}

/**
 * Parses and approximates years of experience from resume text.
 */
function parseYearsOfExperience(text) {
  const cleaned = cleanText(text);
  let totalYears = 0;

  // Pattern 1: Matching explicit phrases like "5 years of experience", "10+ yrs experience"
  const experienceRegexes = [
    /(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/gi,
    /experience\s*:\s*(\d{1,2})\+?\s*(?:years?|yrs?)/gi,
    /work\s+experience\s*:\s*(\d{1,2})/gi,
    /(\d{1,2})\+?\s*(?:years?|yrs?)\s+exp/gi
  ];

  for (const regex of experienceRegexes) {
    let match;
    while ((match = regex.exec(cleaned)) !== null) {
      const yrs = parseInt(match[1], 10);
      if (yrs > totalYears && yrs < 45) { // Sanity check to prevent picking up arbitrary high numbers
        totalYears = yrs;
      }
    }
  }

  // Pattern 2: Checking date ranges to sum them up, e.g. "2018 - 2022" or "2019 to Present"
  // This extracts years and adds them up, keeping it highly robust.
  const dateRangeRegex = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?[a-z]*\.?\s*(\d{4})\s*[-–—to]+\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?[a-z]*\.?\s*(\d{4})|[pP]resent|[cC]urrent)/gi;
  let match;
  let rangesCalculated = 0;
  const currentYear = new Date().getFullYear();

  while ((match = dateRangeRegex.exec(cleaned)) !== null) {
    const startYear = parseInt(match[1], 10);
    const endStr = match[2];
    const endYear = endStr ? parseInt(endStr, 10) : currentYear;

    if (startYear >= 1990 && startYear <= currentYear && endYear >= startYear && endYear <= currentYear + 1) {
      const diff = endYear - startYear;
      rangesCalculated += diff;
    }
  }

  // Use the larger of either explicit mention or date calculations
  const finalYears = Math.max(totalYears, Math.min(rangesCalculated, 40));
  return finalYears > 0 ? finalYears : 1; // Default to 1 year if not clearly specified rather than 0
}

/**
 * Detects the highest level of education in the resume.
 */
function parseEducationLevel(text) {
  const cleaned = cleanText(text);

  const degreeHierarchy = [
    { level: 4, name: 'PhD / Doctorate', regex: /\b(phd|p\.h\.d\.|doctorate|doctor of philosophy)\b/i },
    { level: 3, name: 'Master\'s Degree', regex: /\b(masters?|m\.s\.|m\.sc\.|mtech|mba|master of)\b/i },
    { level: 2, name: 'Bachelor\'s Degree', regex: /\b(bachelors?|b\.s\.|b\.sc\.|btech|b\.e\.|b\.a\.|bachelor of)\b/i },
    { level: 1, name: 'Associate Degree / Diploma', regex: /\b(associate degree|diploma|associates)\b/i }
  ];

  for (const deg of degreeHierarchy) {
    if (deg.regex.test(cleaned)) {
      return deg;
    }
  }

  return { level: 0, name: 'High School / Other' };
}

/**
 * Guesses the education requirement level of a Job Description.
 */
function parseJDEducationRequirement(text) {
  const cleaned = cleanText(text);

  const degreeHierarchy = [
    { level: 4, name: 'PhD / Doctorate', regex: /\b(phd|p\.h\.d\.|doctorate)\b/i },
    { level: 3, name: 'Master\'s Degree', regex: /\b(masters?|m\.s\.|m\.sc\.|mtech|mba)\b/i },
    { level: 2, name: 'Bachelor\'s Degree', regex: /\b(bachelors?|b\.s\.|b\.sc\.|btech|b\.e\.)\b/i }
  ];

  for (const deg of degreeHierarchy) {
    if (deg.regex.test(cleaned)) {
      return deg.level;
    }
  }

  return 2; // Default required is Bachelor's level if not explicitly specified
}

/**
 * Extracts candidate name using filename or high probability patterns in text.
 */
function extractCandidateName(text, filename) {
  // If the filename is distinct, parse name from it
  const cleanFilename = filename
    .replace(/\.[^/.]+$/, "") // Strip extension
    .replace(/[-_]resume[-_]?/gi, "") // Strip resume words
    .replace(/[-_]/g, " ") // Replace dashes/underscores with space
    .trim();

  // If filename is generic like "resume", "cv", "upload", look at first 3 lines of resume
  const genericNames = ['resume', 'cv', 'myresume', 'mycv', 'upload', 'file', 'document', 'candidate'];
  const isGeneric = genericNames.some(n => cleanFilename.toLowerCase().startsWith(n)) || cleanFilename.length < 3;

  if (!isGeneric) {
    // Format nicely
    return cleanFilename
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  // Look at text first lines
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length > 0) {
    // Grab first non-empty line
    const firstLine = lines[0];
    // Check if it looks like a name (short, alphabet only, 2-3 words)
    if (firstLine.length < 30 && /^[a-zA-Z\s\.\,\-\'\’]+$/.test(firstLine)) {
      return firstLine.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  return "Candidate " + Math.floor(1000 + Math.random() * 9000);
}

/**
 * Scores a resume against a JD and returns detailed analytics.
 * @param {string} resumeText 
 * @param {string} jdText 
 * @param {string} filename 
 * @returns {object}
 */
function scoreResume(resumeText, jdText, filename) {
  const cleanResume = cleanText(resumeText);
  const cleanJD = cleanText(jdText);

  // 1. Skill Matching
  const jdSkills = extractSkills(jdText);
  const resumeSkills = extractSkills(resumeText);

  let skillsScore = 100;
  let matchingSkills = [];
  let missingSkills = [];

  if (jdSkills.length > 0) {
    matchingSkills = resumeSkills.filter(skill => jdSkills.includes(skill));
    missingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));
    skillsScore = Math.round((matchingSkills.length / jdSkills.length) * 100);
  } else {
    // Fallback: If JD has no clear skills, match generic technology skills in the resume
    matchingSkills = resumeSkills.slice(0, 10);
    skillsScore = resumeSkills.length >= 5 ? 85 : 50;
  }

  // 2. Experience Relevance
  const resumeExperience = parseYearsOfExperience(resumeText);
  // Match expected experience in JD
  let jdExperienceRequirement = 2; // default 2 years
  const jdExpMatch = /(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/i.exec(cleanJD);
  if (jdExpMatch) {
    jdExperienceRequirement = parseInt(jdExpMatch[1], 10);
  }

  let experienceScore = 100;
  if (resumeExperience < jdExperienceRequirement) {
    // Penalty for less experience
    const ratio = resumeExperience / jdExperienceRequirement;
    experienceScore = Math.round(50 + ratio * 40); // bounds [50, 90]
  } else if (resumeExperience > jdExperienceRequirement + 5) {
    // Slight over-qualification adjustments or full score
    experienceScore = 95;
  } else {
    experienceScore = 100;
  }

  // 3. Education Alignment
  const candidateDegree = parseEducationLevel(resumeText);
  const requiredDegreeLevel = parseJDEducationRequirement(jdText);

  let educationScore = 100;
  if (candidateDegree.level < requiredDegreeLevel) {
    // Deduct score based on disparity
    const diff = requiredDegreeLevel - candidateDegree.level;
    educationScore = Math.max(50, 100 - (diff * 20));
  }

  // 4. Keyword Similarity
  const keywordSimilarity = calculateCosineSimilarity(resumeText, jdText);

  // 5. Aggregate Score (Weighted)
  // Weights: Skills (40%), Experience (25%), Education (15%), Cosine Similarity (20%)
  const finalScore = Math.round(
    (skillsScore * 0.40) +
    (experienceScore * 0.25) +
    (educationScore * 0.15) +
    (keywordSimilarity * 0.20)
  );

  // Extract Candidate Name
  const candidateName = extractCandidateName(resumeText, filename);

  // Status mapping
  let matchStatus = 'Low Fit';
  if (finalScore >= 80) matchStatus = 'Strong Match';
  else if (finalScore >= 60) matchStatus = 'Good Match';
  else if (finalScore >= 40) matchStatus = 'Potential';

  // Summarize resume content (First few paragraphs) for the drawer preview
  const paragraphs = resumeText
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 30)
    .slice(0, 8); // Grab up to 8 nice blocks of text

  const resumeSummary = paragraphs.join('\n\n') || "No summary text could be parsed. The file might contain structured text in boxes, or columns.";

  return {
    candidateName,
    score: finalScore,
    matchStatus,
    matchBreakdown: {
      skillsScore,
      experienceScore,
      educationScore,
      keywordSimilarity
    },
    matchingSkills,
    missingSkills,
    experienceYears: resumeExperience,
    jdExperienceRequirement,
    education: candidateDegree.name,
    resumeSummary,
    fileName: filename
  };
}

module.exports = {
  scoreResume
};
