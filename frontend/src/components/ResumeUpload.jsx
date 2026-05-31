import React, { useRef, useState } from 'react';
import { Upload, FileText, X, AlertCircle, FileSpreadsheet } from 'lucide-react';

export default function ResumeUpload({ files, setFiles }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFiles = (fileList) => {
    const validExtensions = ['pdf', 'docx', 'doc', 'txt'];
    const addedFiles = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const ext = file.name.split('.').pop().toLowerCase();
      
      // Avoid duplicate uploads by comparing name and size
      const isDuplicate = files.some(f => f.name === file.name && f.size === file.size);

      if (validExtensions.includes(ext)) {
        if (!isDuplicate) {
          addedFiles.push(file);
        }
      } else {
        alert(`Unsupported file format: ${file.name}. Please upload PDF, DOCX, or TXT files.`);
      }
    }

    if (addedFiles.length > 0) {
      setFiles((prev) => [...prev, ...addedFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (idxToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      return <FileText size={18} style={{ color: '#ef4444' }} />;
    } else if (['docx', 'doc'].includes(ext)) {
      return <FileSpreadsheet size={18} style={{ color: '#3b82f6' }} />;
    }
    return <FileText size={18} style={{ color: '#94a3b8' }} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="setup-panel glass-panel animate-fade-in">
      <h2 className="panel-title">
        <Upload size={20} />
        Step 2: Candidate Resumes
      </h2>

      <p className="description" style={{ marginBottom: '1.5rem' }}>
        Select or drag multiple resumes to process. You can upload single or batch profiles for parsing and comparison.
      </p>

      {/* Drag Drop Box */}
      <div
        className={`upload-zone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept=".pdf,.docx,.doc,.txt"
          multiple
          style={{ display: 'none' }}
        />
        
        <div className="upload-icon-wrapper">
          <Upload size={32} />
        </div>
        
        <div>
          <p style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
            Drag and drop resume files here
          </p>
          <p style={{ fontSize: '0.8rem' }}>
            or click to browse local files
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <AlertCircle size={12} />
          <span>Supported: PDF, DOC, DOCX, TXT (Max 10MB each)</span>
        </div>
      </div>

      {/* Uploaded File List Preview */}
      {files.length > 0 && (
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ margin: 0 }}>Selected Profiles ({files.length})</label>
            <button
              type="button"
              className="template-pill"
              onClick={() => setFiles([])}
              style={{ padding: '0.2rem 0.5rem', background: 'transparent', margin: 0 }}
            >
              Clear All
            </button>
          </div>

          <div className="file-list" style={{ maxHeight: '240px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            {files.map((file, idx) => (
              <div key={idx} className="file-item">
                <div className="file-info">
                  {getFileIcon(file.name)}
                  <span className="file-name" title={file.name}>
                    {file.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                <button
                  type="button"
                  className="file-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
