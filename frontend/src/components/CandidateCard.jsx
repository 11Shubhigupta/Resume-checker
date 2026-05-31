import React from 'react';
import { Calendar, Award, ChevronRight, Briefcase, GraduationCap } from 'lucide-react';

export default function CandidateCard({ candidate, onViewDetails }) {
  const {
    rank,
    candidateName,
    score,
    matchStatus,
    status,
    experienceYears,
    education,
    matchingSkills,
    fileName
  } = candidate;

  // Calculate SVG circular path offsets
  const radius = 28;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Get status color mappings
  const getMatchClass = () => {
    if (score >= 80) return 'match-strong';
    if (score >= 60) return 'match-good';
    if (score >= 40) return 'match-potential';
    return 'match-low';
  };

  const getPipelineBadge = () => {
    switch (status) {
      case 'Shortlisted':
        return <span className="badge badge-success">Shortlisted</span>;
      case 'Interviewing':
        return <span className="badge badge-info">Interviewing</span>;
      case 'Rejected':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-neutral">Screened</span>;
    }
  };

  return (
    <div className={`glass-panel candidate-card ${getMatchClass()} animate-fade-in`}>
      
      {/* Name and Basic Metrics Info */}
      <div className="card-left-section">
        {/* Rank */}
        <div className="rank-indicator">
          #{rank}
        </div>

        {/* Circular Progress Gauge */}
        <div className="score-radial-wrapper">
          <svg className="score-radial-svg" viewBox="0 0 72 72">
            <circle
              className="radial-bg"
              cx="36"
              cy="36"
              r={radius}
            />
            <circle
              className="radial-progress"
              cx="36"
              cy="36"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                strokeWidth: strokeWidth
              }}
            />
          </svg>
          <div className="score-center-text" style={{ color: 'var(--text-main)' }}>
            {score}%
          </div>
        </div>

        {/* Name and Career Details */}
        <div className="cand-basic-info">
          <div className="cand-name-row">
            <h3 className="cand-name">{candidateName}</h3>
            {getPipelineBadge()}
          </div>

          <div className="cand-metadata">
            <span className="cand-meta-item">
              <Briefcase size={14} />
              {experienceYears} Year{experienceYears !== 1 ? 's' : ''} Exp
            </span>
            <span className="cand-meta-item">
              <GraduationCap size={14} />
              {education}
            </span>
            <span className="cand-meta-item" title={fileName}>
              <Calendar size={14} />
              {fileName.length > 22 ? fileName.substring(0, 19) + '...' : fileName}
            </span>
          </div>

          {/* Core Matching Skills Previews */}
          {matchingSkills.length > 0 && (
            <div className="skills-preview-row">
              {matchingSkills.slice(0, 4).map((skill, index) => (
                <span key={index} className="skill-tag matching">
                  {skill}
                </span>
              ))}
              {matchingSkills.length > 4 && (
                <span className="skill-tag" style={{ background: 'rgba(255,255,255,0.01)', borderStyle: 'dashed' }}>
                  +{matchingSkills.length - 4} More
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="card-actions-wrapper">
        <button
          type="button"
          className="btn btn-secondary btn-outline"
          onClick={() => onViewDetails(candidate)}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          View Analysis
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
