import React, { DragEvent, useRef, useState } from 'react';
import { FileText, FileUp, FileCheck2, X } from 'lucide-react';

type ResumeDropzoneProps = {
  file: File | null;
  onFile: (file: File | null) => void;
  label?: string;
  onRejected?: (message: string) => void;
};

const formatSize = (bytes: number) => bytes < 1024 * 1024
  ? `${Math.max(1, Math.round(bytes / 1024))} KB`
  : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const ResumeDropzone: React.FC<ResumeDropzoneProps> = ({ file, onFile, label = 'Resume file', onRejected }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const takeFile = (candidate?: File) => {
    if (!candidate) return;
    const extension = candidate.name.split('.').pop()?.toLowerCase();
    if (extension === 'pdf' || extension === 'docx') onFile(candidate);
    else onRejected?.('Choose a PDF or DOCX file to continue.');
  };
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    takeFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="cf-upload-group">
      <label className="cf-field-label">{label}</label>
      <input ref={inputRef} className="cf-visually-hidden" type="file" accept=".pdf,.docx" aria-label={label} onChange={(event) => takeFile(event.target.files?.[0])} />
      {file ? (
        <div className="cf-file-selected">
          <span className="cf-file-icon"><FileCheck2 size={20} /></span>
          <div className="cf-file-meta"><strong>{file.name}</strong><span>{formatSize(file.size)} · {file.name.split('.').pop()?.toUpperCase()} document</span></div>
          <button className="cf-icon-button" type="button" aria-label="Remove selected resume" onClick={() => { onFile(null); if (inputRef.current) inputRef.current.value = ''; }}><X size={17} /></button>
        </div>
      ) : (
        <div
          className={`cf-dropzone${dragging ? ' is-dragging' : ''}`}
          role="button"
          tabIndex={0}
          aria-label="Choose or drop a PDF or DOCX resume"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); inputRef.current?.click(); } }}
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <span className="cf-upload-icon"><FileUp size={21} /></span>
          <strong>Drop your resume here, or <span>browse files</span></strong>
          <small>PDF or DOCX · no upload size limit is configured</small>
        </div>
      )}
      {file && <p className="cf-file-helper"><FileText size={14} /> Your document is processed for this analysis and isn’t retained as an uploaded file.</p>}
    </div>
  );
};

export default ResumeDropzone;
