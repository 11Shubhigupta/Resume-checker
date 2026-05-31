import React, { useRef, useState } from 'react';
import { FileText, Upload, Briefcase, Check, AlertCircle } from 'lucide-react';

const JD_TEMPLATES = [
  {
    title: "React Frontend Developer",
    experience: "3+ years",
    text: `Position: Senior React Frontend Developer
Experience Required: 3-5 years of professional software engineering experience.

Key Skills:
- React.js, React Hooks, Redux Toolkit
- JavaScript (ES6+), TypeScript
- CSS Grid, Flexbox, Tailwind CSS, Responsive Design
- Git, GitHub, REST APIs
- Modern tools like Webpack, Vite, Jest, Cypress

Education:
- Bachelor's Degree in Computer Science, Software Engineering, or related technical field.`
  },
  {
    title: "Python Data Scientist",
    experience: "2+ years",
    text: `Position: Data Scientist / Machine Learning Engineer
Experience Required: 2+ years of experience working with machine learning models and data analysis pipelines.

Key Skills:
- Python (Pandas, NumPy, Scikit-learn)
- Machine Learning models (Regression, Random Forests, XGBoost)
- Deep Learning frameworks (TensorFlow, PyTorch)
- SQL Databases, Git, GitHub
- Natural Language Processing (NLP) or Computer Vision is a plus

Education:
- Master's or Bachelor's Degree in Computer Science, Statistics, Mathematics, or Data Science.`
  },
  {
    title: "Node.js Fullstack Engineer",
    experience: "4+ years",
    text: `Position: Full Stack Engineer (Node.js & React)
Experience Required: 4+ years of building full-stack web applications.

Key Skills:
- Node.js, Express.js, REST APIs
- MongoDB, PostgreSQL, SQL, Redis
- React, JavaScript, HTML5, CSS3
- Docker, AWS cloud services (S3, EC2, Lambda)
- Agile Methodologies, Git, CI/CD, Jest unit testing

Education:
- Bachelor's Degree in Computer Science, engineering or equivalent work experience.`
  }
];

export default function JobInput({ jdText, setJdText, jdFile, setJdFile }) {
  const fileInputRef = useRef(null);
  const [activeTemplate, setActiveTemplate] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const validTypes = ['pdf', 'docx', 'doc', 'txt'];
      if (!validTypes.includes(ext)) {
        alert('Invalid file format. Please upload a PDF, DOCX, DOC, or TXT file.');
        return;
      }
      setJdFile(file);
      setActiveTemplate(null);
    }
  };

  const selectTemplate = (index) => {
    setActiveTemplate(index);
    setJdText(JD_TEMPLATES[index].text);
    setJdFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearJDFile = () => {
    setJdFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="setup-panel glass-panel animate-fade-in">
      <h2 className="panel-title">
        <Briefcase size={20} />
        Step 1: Job Description
      </h2>

      <p className="description" style={{ marginBottom: '1.25rem' }}>
        Provide the criteria to screen candidates. Select a preset template, type/paste criteria manually, or upload the JD file.
      </p>

      {/* Templates Row */}
      <label>Preset JDs (For Quick Testing)</label>
      <div className="template-pills">
        {JD_TEMPLATES.map((tpl, idx) => (
          <button
            key={idx}
            type="button"
            className={`template-pill ${activeTemplate === idx ? 'active' : ''}`}
            onClick={() => selectTemplate(idx)}
          >
            {tpl.title} ({tpl.experience})
          </button>
        ))}
      </div>

      {/* Manual Input Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="jd-textarea">Enter Job Description Manually</label>
          <textarea
            id="jd-textarea"
            placeholder="Paste your job description requirements, technical skills, requested education, and years of experience here..."
            value={jdText}
            onChange={(e) => {
              setJdText(e.target.value);
              if (activeTemplate !== null) setActiveTemplate(null);
            }}
            rows={10}
            style={{ resize: 'vertical', minHeight: '180px' }}
            disabled={!!jdFile}
          />
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '0.25rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ padding: '0 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Upload JD Document */}
        <div>
          <label>Upload JD Document</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,.txt"
            style={{ display: 'none' }}
          />

          {!jdFile ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Upload size={18} />
              Upload Job Description File
            </button>
          ) : (
            <div className="file-item" style={{ border: '1px solid rgba(6, 182, 212, 0.2)', background: 'rgba(6, 182, 212, 0.04)' }}>
              <div className="file-info">
                <FileText size={18} style={{ color: 'var(--secondary)' }} />
                <span className="file-name" style={{ color: 'var(--secondary)', fontWeight: 500 }}>
                  {jdFile.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ({Math.round(jdFile.size / 1024)} KB)
                </span>
              </div>
              <button type="button" className="file-remove" onClick={clearJDFile} aria-label="Remove uploaded job description file">
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
