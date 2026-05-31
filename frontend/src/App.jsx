import React, { useState, useEffect } from 'react';
import { Target, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import JobInput from './components/JobInput';
import ResumeUpload from './components/ResumeUpload';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import CandidateDrawer from './components/CandidateDrawer';

export default function App() {
  // Global States
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [resumeFiles, setResumeFiles] = useState([]);
  
  const [step, setStep] = useState('SETUP'); // SETUP -> SCREENING -> RESULTS
  const [candidates, setCandidates] = useState([]);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fetch existing screen state on mount (allows page refresh persistence!)
  useEffect(() => {
    const fetchExistingState = async () => {
      try {
        const res = await fetch('/api/candidates');
        if (res.ok) {
          const data = await res.json();
          if (data.candidates && data.candidates.length > 0) {
            setCandidates(data.candidates);
            setJdText(data.jobDescription);
            setStep('RESULTS');
          }
        }
      } catch (err) {
        console.error('Could not restore previous state:', err);
      }
    };
    fetchExistingState();
  }, []);

  const handleScreenResumes = async () => {
    // Validations
    if (!jdFile && (!jdText || jdText.trim().length < 15)) {
      setErrorMessage('Please enter a valid Job Description or upload a JD document.');
      return;
    }
    if (resumeFiles.length === 0) {
      setErrorMessage('Please upload at least one candidate resume.');
      return;
    }

    setErrorMessage('');
    setStep('SCREENING');

    const formData = new FormData();
    
    // Append resumes
    resumeFiles.forEach((file) => {
      formData.append('resumes', file);
    });

    // Append Job Description details
    if (jdFile) {
      formData.append('jobDescriptionFile', jdFile);
    } else {
      formData.append('jobDescriptionText', jdText);
    }

    try {
      const response = await fetch('/api/screen', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resumes. Please check file formatting.');
      }

      setCandidates(data.candidates);
      setStep('RESULTS');
    } catch (err) {
      console.error('Screening Error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during analysis.');
      setStep('SETUP');
    }
  };

  const handleUpdateCandidate = async (candidateId, payload) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        // Update local candidates list in place
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidateId ? { ...c, ...data.candidate } : c))
        );
        // Sync active candidate drawer
        if (activeCandidate && activeCandidate.id === candidateId) {
          setActiveCandidate((prev) => ({ ...prev, ...data.candidate }));
        }
      }
    } catch (err) {
      console.error('Failed to update candidate:', err);
    }
  };

  const handleReset = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (e) {}

    // Reset UI states
    setCandidates([]);
    setResumeFiles([]);
    setJdFile(null);
    setJdText('');
    setActiveCandidate(null);
    setErrorMessage('');
    setStep('SETUP');
  };

  return (
    <div className="app-container">
      
      {/* Dynamic Navigation Header */}
      <header className="app-header">
        <div className="logo-block">
          <div className="logo-icon">
            <Target size={24} style={{ color: 'white' }} />
          </div>
          <div className="logo-text">
            <h1>TalentScope AI</h1>
            <p>Resume Screening & Ranking Hub</p>
          </div>
        </div>

        {step === 'RESULTS' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="badge badge-success" style={{ padding: '0.4rem 0.8rem' }}>
              <Layers size={12} />
              {candidates.length} Profiles Ranked
            </span>
            <button className="btn btn-secondary" onClick={() => setStep('SETUP')} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Add Resumes / Edit JD
            </button>
            <button className="btn btn-secondary" onClick={handleReset} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              <RefreshCw size={14} />
              Reset All
            </button>
          </div>
        )}
      </header>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="glass-panel animate-fade-in" style={{
          borderLeft: '4px solid var(--accent-danger)',
          background: 'rgba(239, 68, 68, 0.05)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={20} style={{ color: 'var(--accent-danger)' }} />
          <div>
            <h4 style={{ color: 'var(--accent-danger)', fontSize: '0.9rem' }}>Evaluation Alert</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Dynamic State rendering */}
      {step === 'SETUP' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="setup-grid">
            <JobInput
              jdText={jdText}
              setJdText={setJdText}
              jdFile={jdFile}
              setJdFile={setJdFile}
            />

            <ResumeUpload
              files={resumeFiles}
              setFiles={setResumeFiles}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleScreenResumes}
              disabled={resumeFiles.length === 0 || (!jdFile && !jdText)}
              style={{ padding: '1rem 3rem', fontSize: '1.05rem', minWidth: '320px' }}
            >
              Analyze & Rank Profiles
            </button>
          </div>

        </div>
      )}

      {step === 'SCREENING' && (
        <LoadingScreen fileCount={resumeFiles.length} />
      )}

      {step === 'RESULTS' && (
        <Dashboard
          candidates={candidates}
          onReset={handleReset}
          onEdit={() => setStep('SETUP')}
          onViewDetails={setActiveCandidate}
          onUpdateCandidate={handleUpdateCandidate}
        />
      )}

      {/* Slide-out Candidate Drawer modal */}
      {activeCandidate && (
        <CandidateDrawer
          candidate={activeCandidate}
          onClose={() => setActiveCandidate(null)}
          onUpdateCandidate={handleUpdateCandidate}
        />
      )}

    </div>
  );
}
