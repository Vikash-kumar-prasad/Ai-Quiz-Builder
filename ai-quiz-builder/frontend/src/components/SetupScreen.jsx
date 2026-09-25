import { useRef, useState } from "react";
import {
  SparklesIcon,
  UploadIcon,
  FileTextIcon,
  TrashIcon,
  ArrowRightIcon,
  TimerIcon,
  AlertCircleIcon,
} from "./icons.jsx";

const SUGGESTED_TOPICS = [
  "JavaScript & React Patterns",
  "System Design Fundamentals",
  "Machine Learning & AI",
  "World History & Revolutions",
  "Python Core Concepts",
];

export default function SetupScreen({
  mode,
  setMode,
  topic,
  setTopic,
  notes,
  setNotes,
  fileName,
  onClearFile,
  count,
  setCount,
  difficulty,
  setDifficulty,
  timerSeconds = 0,
  setTimerSeconds,
  errorMsg,
  canGenerate,
  onGenerate,
  onFileSelected,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  }

  const fileExtension = fileName ? fileName.split(".").pop().toUpperCase() : "";

  return (
    <div className="panel stage-enter">
      {/* Top Badge */}
      <div className="brand-nav">
        <div className="brand-badge">
          <span className="pulse-dot" />
          <span>AI ASSESSMENT ENGINE</span>
        </div>
      </div>

      <div className="eyebrow">Smart Quiz Generator</div>
      <h1 className="headline">What would you like to master today?</h1>
      <p className="sub">
        Enter a topic or upload your study documents. Generate a custom, curriculum-grade assessment in seconds.
      </p>

      {/* Mode Tabs */}
      <div className="tabs" role="tablist" aria-label="Input mode selector">
        <button
          role="tab"
          aria-selected={mode === "topic"}
          className={`tab-btn ${mode === "topic" ? "active" : ""}`}
          onClick={() => setMode("topic")}
        >
          <SparklesIcon size={16} />
          <span>Topic Prompt</span>
        </button>
        <button
          role="tab"
          aria-selected={mode === "notes"}
          className={`tab-btn ${mode === "notes" ? "active" : ""}`}
          onClick={() => setMode("notes")}
        >
          <FileTextIcon size={16} />
          <span>Document / Notes</span>
        </button>
      </div>

      {mode === "topic" ? (
        <div>
          <label htmlFor="topic-input" className="field-label">
            Target Subject or Concept
          </label>
          <input
            id="topic-input"
            type="text"
            placeholder="e.g. Microservices vs Monoliths, Cellular Respiration, Docker..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canGenerate && onGenerate()}
          />

          {/* Quick topic suggestion chips */}
          <div className="topic-chips">
            <span className="chip-label">Quick Suggestions:</span>
            {SUGGESTED_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                className="topic-chip"
                onClick={() => setTopic(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="notes-input" className="field-label">
            Paste Notes or Upload Files
          </label>
          <textarea
            id="notes-input"
            rows={5}
            placeholder="Paste your lecture notes, textbook excerpt, or meeting summary here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* Drag & Drop Upload Zone */}
          {!fileName ? (
            <div
              className={`file-dropzone ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileInputRef.current?.click()}
            >
              <div className="file-dropzone-icon">
                <UploadIcon size={22} />
              </div>
              <div className="file-dropzone-title">
                Click or drop documents to extract text
              </div>
              <div className="file-dropzone-hint">
                Supports .PDF, .DOCX, .PPTX, and .TXT (Max 50MB)
              </div>
            </div>
          ) : (
            <div className="file-selected-card">
              <div className="file-info">
                <span className="file-badge">{fileExtension}</span>
                <span className="file-name" title={fileName}>{fileName}</span>
              </div>
              <button
                type="button"
                className="file-remove-btn"
                title="Remove uploaded file"
                aria-label="Remove uploaded file"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClearFile) onClearFile();
                  else {
                    setNotes("");
                  }
                }}
              >
                <TrashIcon size={16} />
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.docx,.pdf,.pptx"
            onChange={(e) => e.target.files?.[0] && onFileSelected(e.target.files[0])}
            style={{ display: "none" }}
          />
        </div>
      )}

      {/* Parameters Row */}
      <div className="controls-row">
        <div>
          <label htmlFor="question-count-display" className="field-label">
            Questions
          </label>
          <div className="stepper" id="question-count-display">
            <button
              type="button"
              className="step-btn"
              aria-label="Decrease question count"
              disabled={count <= 3}
              onClick={() => setCount(Math.max(3, count - 1))}
            >
              −
            </button>
            <span>{count}</span>
            <button
              type="button"
              className="step-btn"
              aria-label="Increase question count"
              disabled={count >= 15}
              onClick={() => setCount(Math.min(15, count + 1))}
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="difficulty-select" className="field-label">
            Difficulty
          </label>
          <select
            id="difficulty-select"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy (Foundational)</option>
            <option value="medium">Medium (Standard)</option>
            <option value="hard">Hard (Advanced)</option>
          </select>
        </div>

        {setTimerSeconds && (
          <div>
            <label htmlFor="timer-select" className="field-label">
              Timer
            </label>
            <select
              id="timer-select"
              value={timerSeconds}
              onChange={(e) => setTimerSeconds(Number(e.target.value))}
            >
              <option value={0}>Untimed</option>
              <option value={30}>30s / Question</option>
              <option value={45}>45s / Question</option>
              <option value={60}>60s / Question</option>
            </select>
          </div>
        )}
      </div>

      {/* Generate CTA Button */}
      <button
        className="generate-btn"
        disabled={!canGenerate}
        onClick={onGenerate}
      >
        <SparklesIcon size={18} />
        <span>Generate Quiz</span>
        <ArrowRightIcon size={18} />
      </button>

      {errorMsg && (
        <div className="error-box" role="alert">
          <AlertCircleIcon size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
