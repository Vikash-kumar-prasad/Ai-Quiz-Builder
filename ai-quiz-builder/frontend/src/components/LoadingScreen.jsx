// Shown while we're waiting on the backend/AI provider to generate questions.
export default function LoadingScreen() {
  return (
    <div className="loading-wrap stage-enter">
      <svg className="chalk-spinner" width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" />
      </svg>
      <div className="loading-text">
        Writing your questions
        <span className="loading-dots"><span>.</span><span>.</span><span>.</span></span>
      </div>
    </div>
  );
}
