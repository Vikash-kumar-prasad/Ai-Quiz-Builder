import { useRef } from "react";
import { ChalkUnderline } from "./icons.jsx";

// The first screen the user sees: choose a topic or paste/upload notes,
// pick question count + difficulty, then generate.
export default function SetupScreen({
  mode, setMode,
  topic, setTopic,
  notes, setNotes,
  fileName,
  count, setCount,
  difficulty, setDifficulty,
  errorMsg,
  canGenerate,
  onGenerate,
  onFileSelected,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="panel stage-enter">
      <div className="eyebrow">Class in session</div>
      <h1 className="headline">What are we quizzing on today?</h1>
      <ChalkUnderline width={260} />
      <p className="sub" style={{ marginTop: 14 }}>
        Give a topic, or paste/upload your own notes — either way you'll get a fresh quiz in seconds.
      </p>

      <div className="tabs">
        <button className={`tab-btn ${mode === "topic" ? "active" : ""}`} onClick={() => setMode("topic")}>
          Topic
        </button>
        <button className={`tab-btn ${mode === "notes" ? "active" : ""}`} onClick={() => setMode("notes")}>
          Paste / upload notes
        </button>
      </div>

      {mode === "topic" ? (
        <input
          type="text"
          placeholder="e.g. The French Revolution, React hooks, cellular respiration..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      ) : (
        <>
          <textarea
            rows={7}
            placeholder="Paste your notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="file-row">
            <button className="file-btn" onClick={() => fileInputRef.current?.click()}>
              Upload .txt, .docx, .pdf, or .pptx
            </button>
            {fileName && <span>{fileName}</span>}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.docx,.pdf,.pptx"
              onChange={(e) => e.target.files?.[0] && onFileSelected(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>
        </>
      )}

      <div className="controls-row">
        <div>
          <span className="field-label">Questions</span>
          <div className="stepper">
            <button className="step-btn" onClick={() => setCount(Math.max(3, count - 1))}>−</button>
            <span>{count}</span>
            <button className="step-btn" onClick={() => setCount(Math.min(15, count + 1))}>+</button>
          </div>
        </div>
        <div>
          <span className="field-label">Difficulty</span>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <button className="generate-btn" disabled={!canGenerate} onClick={onGenerate}>
        Generate quiz →
      </button>

      {errorMsg && <div className="error-box">{errorMsg}</div>}
    </div>
  );
}
