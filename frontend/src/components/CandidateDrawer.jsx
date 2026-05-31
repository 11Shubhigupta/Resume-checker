import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, FileText, BarChart3, Settings, ClipboardList, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CandidateDrawer({ candidate, onClose, onUpdateCandidate }) {
  const [pipelineStatus, setPipelineStatus] = useState(candidate.status);
  const [notesText, setNotesText] = useState(candidate.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPipelineStatus(candidate.status);
    setNotesText(candidate.notes || '');
  }, [candidate]);

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateCandidate(candidate.id, {
      status: pipelineStatus,
      notes: notesText
    });
    setIsSaving(false);
  };

  const {
    candidateName,
    score,
    matchStatus,
    matchBreakdown,
    matchingSkills,
    missingSkills,
    experienceYears,
    jdExperienceRequirement,
    education,
    resumeSummary,
    fileName
  } = candidate;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div className="drawer-header">
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', fontWeight: 600 }}>
              Rank Profile #{candidate.rank}
            </span>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginTop: '0.2rem', marginBottom: '0.4rem' }}>
              {candidateName}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Source: {fileName}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', fontFamily: 'var(--font-family-display)' }}>
                {score}%
              </div>
              <span className={`badge ${score >= 80 ? 'badge-success' : score >= 60 ? 'badge-info' : 'badge-warning'}`}>
                {matchStatus}
              </span>
            </div>
            <button className="drawer-close" onClick={onClose} aria-label="Close details">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Drawer Scroll Body */}
        <div className="drawer-body">
          
          {/* Subscores Breakdown */}
          <div>
            <h3 className="section-title">
              <BarChart3 size={16} />
              Evaluation Metrics
            </h3>
            
            <div className="breakdown-grid">
              
              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span>Skills Core Alignment</span>
                  <span style={{ color: 'var(--primary)' }}>{matchBreakdown.skillsScore}%</span>
                </div>
                <div className="breakdown-bar-bg">
                  <div className="breakdown-bar-fill" style={{ width: `${matchBreakdown.skillsScore}%`, background: 'var(--primary)' }} />
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span>Timeline Relevancy</span>
                  <span style={{ color: 'var(--secondary)' }}>{matchBreakdown.experienceScore}%</span>
                </div>
                <div className="breakdown-bar-bg">
                  <div className="breakdown-bar-fill" style={{ width: `${matchBreakdown.experienceScore}%`, background: 'var(--secondary)' }} />
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
                  Has {experienceYears} yr{experienceYears !== 1 ? 's' : ''} (Required: {jdExperienceRequirement} yr{jdExperienceRequirement !== 1 ? 's' : ''})
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span>Academic Standing</span>
                  <span style={{ color: 'var(--accent-success)' }}>{matchBreakdown.educationScore}%</span>
                </div>
                <div className="breakdown-bar-bg">
                  <div className="breakdown-bar-fill" style={{ width: `${matchBreakdown.educationScore}%`, background: 'var(--accent-success)' }} />
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>
                  Highest: {education}
                </div>
              </div>

              <div className="breakdown-item">
                <div className="breakdown-label">
                  <span>Vocabulary Density (Cosine)</span>
                  <span style={{ color: 'var(--accent-info)' }}>{matchBreakdown.keywordSimilarity}%</span>
                </div>
                <div className="breakdown-bar-bg">
                  <div className="breakdown-bar-fill" style={{ width: `${matchBreakdown.keywordSimilarity}%`, background: 'var(--accent-info)' }} />
                </div>
              </div>

            </div>
          </div>

          {/* Skills Checklist */}
          <div>
            <h3 className="section-title">
              <ClipboardList size={16} />
              Skills Reconciliation
            </h3>
            
            <div className="skills-comparison-box">
              
              {/* Matching */}
              <div className="skills-list-block">
                <h4 className="skills-list-header matching-color">
                  <CheckCircle2 size={16} />
                  Matching Skills ({matchingSkills.length})
                </h4>
                {matchingSkills.length > 0 ? (
                  <div className="skills-flex-wrap">
                    {matchingSkills.map((skill, i) => (
                      <span key={i} className="skill-detailed-tag match">
                        <Check size={12} />
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>No matched keywords found.</p>
                )}
              </div>

              {/* Missing */}
              <div className="skills-list-block">
                <h4 className="skills-list-header missing-color">
                  <AlertTriangle size={16} />
                  Missing Skills ({missingSkills.length})
                </h4>
                {missingSkills.length > 0 ? (
                  <div className="skills-flex-wrap">
                    {missingSkills.map((skill, i) => (
                      <span key={i} className="skill-detailed-tag missing">
                        <AlertCircle size={12} />
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--accent-success)' }}>
                    All target keywords covered!
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Resume Summary Text box */}
          <div>
            <h3 className="section-title">
              <FileText size={16} />
              Extracted Resume Summary
            </h3>
            <div className="resume-preview-panel">
              {resumeSummary}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              *Note: Displaying cleaned summary segments parsed from local file buffers.
            </p>
          </div>

          {/* Recruiter comments and notes */}
          <div>
            <h3 className="section-title">
              <Settings size={16} />
              Evaluation Notes
            </h3>
            <textarea
              placeholder="Type your notes about this candidate here (e.g. 'Strong communications, follow up next Tuesday'...)"
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              rows={3}
              style={{ background: 'rgba(15, 23, 42, 0.4)', fontSize: '0.85rem' }}
            />
          </div>

        </div>

        {/* Drawer Action pipeline Footer */}
        <div className="pipeline-footer">
          <div className="pipeline-group">
            <label htmlFor="pipeline-selector" style={{ margin: 0, whiteSpace: 'nowrap', marginRight: '0.5rem' }}>Pipeline Status</label>
            <select
              id="pipeline-selector"
              className="pipeline-select"
              value={pipelineStatus}
              onChange={(e) => setPipelineStatus(e.target.value)}
            >
              <option value="Screened">Screened (New)</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
