import React, { useState, useEffect } from 'react';
import { Cpu, Loader2 } from 'lucide-react';

const STATUS_LOGS = [
  "Initializing local screening sandbox...",
  "Loading native document text extractors...",
  "Reading binary PDF/DOCX byte buffers...",
  "Running tokenization & cleaning filters...",
  "Extracting candidate matching skills...",
  "Analyzing education level & fields of study...",
  "Calculating career timeline & experience years...",
  "Vectorizing text for vocabulary similarity...",
  "Computing Jaccard keyword matching indices...",
  "Applying weighted matrix ranking scores...",
  "Sorting candidates by relevance fit...",
  "Generating results dashboard..."
];

export default function LoadingScreen({ fileCount }) {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(STATUS_LOGS[0]);

  useEffect(() => {
    // Animate progress up to 98% during processing
    const totalDuration = 2500 + fileCount * 800; // Scaled on resume file size count
    const intervalTime = 80;
    const steps = totalDuration / intervalTime;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.round((currentStep / steps) * 98), 98);
      setProgress(nextProgress);

      // Rotate status logs based on progress threshold
      const logIndex = Math.min(
        Math.floor((nextProgress / 100) * STATUS_LOGS.length),
        STATUS_LOGS.length - 1
      );
      setCurrentLog(STATUS_LOGS[logIndex]);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
      }
    }, intervalTime);

    return () => clearInterval(progressInterval);
  }, [fileCount]);

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '4rem 2rem', marginTop: '1rem' }}>
      <div className="loading-wrapper">
        
        {/* Radar Scanner Animation */}
        <div className="scanner-box">
          <div className="scanner-wave" />
          <Cpu size={40} style={{ color: 'var(--secondary)' }} />
        </div>

        {/* Text Details */}
        <div>
          <h3 className="loader-status-title">Screening Resumes</h3>
          <p style={{ maxWidth: '400px', margin: '0.4rem auto 1rem auto' }}>
            Analyzing {fileCount} candidate profile{fileCount > 1 ? 's' : ''} against job requirements.
          </p>
        </div>

        {/* Custom Progress Bar */}
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-muted)' }}>Progress</span>
            <span style={{ color: 'var(--secondary)' }}>{progress}%</span>
          </div>
          
          <div className="breakdown-bar-bg" style={{ height: '8px', background: 'rgba(255,255,255,0.04)' }}>
            <div
              className="breakdown-bar-fill"
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                boxShadow: '0 0 10px var(--secondary-glow)'
              }}
            />
          </div>
        </div>

        {/* Micro logs indicator */}
        <div className="loader-progress-text">
          <Loader2 size={16} className="spin-icon" style={{ animation: 'spin 1.5s linear infinite' }} />
          <span>{currentLog}</span>
        </div>

      </div>
    </div>
  );
}
