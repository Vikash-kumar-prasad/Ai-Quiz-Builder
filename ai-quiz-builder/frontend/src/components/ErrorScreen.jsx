// Shown when quiz generation fails (backend down, bad response, etc).
export default function ErrorScreen({ errorMsg, onBackToSetup }) {
  return (
    <div className="panel stage-enter">
      <div className="error-box">{errorMsg}</div>
      <button className="restart-btn" style={{ marginTop: 16 }} onClick={onBackToSetup}>
        Back to setup
      </button>
    </div>
  );
}
