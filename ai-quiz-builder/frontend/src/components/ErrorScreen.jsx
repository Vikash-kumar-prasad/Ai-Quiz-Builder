import { AlertCircleIcon, RotateCcwIcon } from "./icons.jsx";

export default function ErrorScreen({ errorMsg, onBackToSetup }) {
  return (
    <div className="panel stage-enter">
      <div className="brand-badge" style={{ background: "var(--color-error-bg)", color: "var(--color-error)", borderColor: "var(--color-error-border)" }}>
        <AlertCircleIcon size={14} />
        <span>GENERATION INTERRUPTED</span>
      </div>

      <h1 className="headline" style={{ marginTop: 12 }}>Unable to complete quiz generation</h1>
      <p className="sub">
        The system encountered an unexpected response or network issue while communicating with the AI service.
      </p>

      <div className="error-box" role="alert">
        <AlertCircleIcon size={20} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Error Details:</strong>
          <div style={{ marginTop: 4 }}>{errorMsg || "An unknown upstream error occurred."}</div>
        </div>
      </div>

      <div style={{ marginTop: 20, fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>
        <strong>Suggested fixes:</strong>
        <ul style={{ paddingLeft: 20, margin: "6px 0 0 0" }}>
          <li>Ensure your Groq API key is configured and valid in <code>backend/.env</code>.</li>
          <li>If using custom notes, ensure they contain clear, readable text.</li>
          <li>Try a slightly broader or more specific topic prompt.</li>
        </ul>
      </div>

      <button className="restart-btn" style={{ marginTop: 24 }} onClick={onBackToSetup}>
        <RotateCcwIcon size={16} style={{ display: "inline-block", verticalAlign: "middle", marginRight: 8 }} />
        <span>Return to Quiz Setup</span>
      </button>
    </div>
  );
}
