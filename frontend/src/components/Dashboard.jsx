import React, { useState } from 'react';
import { Search, SlidersHorizontal, Download, RefreshCw, BarChart2, Star, Users, Briefcase, Upload } from 'lucide-react';
import CandidateCard from './CandidateCard';

export default function Dashboard({ candidates, onReset, onEdit, onViewDetails, onUpdateCandidate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('score-desc');
  const [statusFilter, setStatusFilter] = useState('All');

  // 1. Calculate Dashboard Metrics
  const totalCount = candidates.length;
  const topScore = totalCount > 0 ? candidates[0].score : 0;
  const averageScore = totalCount > 0
    ? Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / totalCount)
    : 0;
  const highFitCount = candidates.filter(c => c.score >= 80).length;

  // 2. Filter Candidates based on Search and Status Filter
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch =
      c.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.matchingSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 3. Sort Candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    switch (sortKey) {
      case 'score-desc':
        return b.score - a.score;
      case 'score-asc':
        return a.score - b.score;
      case 'exp-desc':
        return b.experienceYears - a.experienceYears;
      case 'name-asc':
        return a.candidateName.localeCompare(b.candidateName);
      default:
        return b.score - a.score;
    }
  });

  const handleExport = () => {
    // Navigate directly to download API stream
    window.open('/api/export', '_blank');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Metric Summary Panels */}
      <div className="metrics-row">
        
        <div className="glass-panel metric-card">
          <div>
            <div className="metric-label">Screened Profiles</div>
            <div className="metric-value">{totalCount}</div>
          </div>
          <div className="metric-icon">
            <Users size={22} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div>
            <div className="metric-label">Top Relevance Match</div>
            <div className="metric-value">{topScore}%</div>
          </div>
          <div className="metric-icon">
            <Star size={22} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div>
            <div className="metric-label">Average Fit Rate</div>
            <div className="metric-value">{averageScore}%</div>
          </div>
          <div className="metric-icon">
            <BarChart2 size={22} />
          </div>
        </div>

        <div className="glass-panel metric-card">
          <div>
            <div className="metric-label">Strong Matches (&gt;=80)</div>
            <div className="metric-value">{highFitCount}</div>
          </div>
          <div className="metric-icon" style={{ color: 'var(--accent-success)' }}>
            <Briefcase size={22} />
          </div>
        </div>

      </div>

      {/* 2. Search & Sort Actions Bar */}
      <div className="glass-panel controls-row">
        
        {/* Search */}
        <div className="search-box-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search candidates by name, technology keyword, or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters Group */}
        <div className="filters-group">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              className="sort-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter candidates by status"
            >
              <option value="All">All Statuses</option>
              <option value="Screened">Status: Screened</option>
              <option value="Shortlisted">Status: Shortlisted</option>
              <option value="Interviewing">Status: Interviewing</option>
              <option value="Rejected">Status: Rejected</option>
            </select>
          </div>

          <select
            className="sort-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            aria-label="Sort candidates by parameter"
          >
            <option value="score-desc">Sort: Highest Match</option>
            <option value="score-asc">Sort: Lowest Match</option>
            <option value="exp-desc">Sort: Highest Experience</option>
            <option value="name-asc">Sort: Name (A-Z)</option>
          </select>

          <button
            type="button"
            className="btn btn-secondary btn-outline"
            onClick={handleExport}
            style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
            title="Download CSV report"
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onEdit}
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', background: 'var(--secondary)', boxShadow: '0 4px 14px 0 var(--secondary-glow)' }}
          >
            <Upload size={16} />
            Add Resumes / Edit JD
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onReset}
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#f87171' }}
          >
            <RefreshCw size={16} />
            Reset All
          </button>

        </div>

      </div>

      {/* 3. Candidates List rendering */}
      <div className="candidates-list-container">
        
        {sortedCandidates.length > 0 ? (
          sortedCandidates.map((cand) => (
            <CandidateCard
              key={cand.id}
              candidate={cand}
              onViewDetails={onViewDetails}
            />
          ))
        ) : (
          <div className="glass-panel zero-state">
            <div className="zero-state-icon">
              <Search size={32} />
            </div>
            <h2>No Candidates Found</h2>
            <p style={{ maxWidth: '400px', margin: '0 auto' }}>
              We couldn't find any profiles matching "{searchQuery}" or the selected filters. Try broadening your query or selecting another filter.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
