import { ChalkCheck, ChalkX, ChalkBurst, ScoreRing } from "./icons.jsx";

// Final screen — shows the score as a chalk-drawn ring, a starburst if the
// score is high, and a review of every question with the correct answer.
export default function ResultsScreen({ quiz, answers, onRestart }) {
  const score = answers.filter((a) => a.correct).length;
  const total = quiz.questions.length;
  const pct = Math.round((score / total) * 100);

  return (
    <div className="results-wrap stage-enter">
      <div className="eyebrow" style={{ textAlign: "center" }}>Graded</div>
      <h1 className="headline">{quiz.title}</h1>

      <div style={{ position: "relative", display: "inline-block", margin: "14px 0", width: 180, height: 180 }}>
        {pct >= 80 && (
          <div style={{ position: "absolute", inset: -20 }}>
            <ChalkBurst />
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ScoreRing pct={pct} />
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span className="score-num">{score}/{total}</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "var(--chalk-dim)" }}>{pct}%</span>
        </div>
      </div>

      <div style={{ textAlign: "left", marginTop: 10 }}>
        {quiz.questions.map((q, i) => (
          <div key={i} className="review-item">
            <div className="review-q">
              {answers[i]?.correct ? <ChalkCheck size={16} /> : <ChalkX size={16} />}
              <span>{q.question}</span>
            </div>
            <div className="review-explain">
              Correct answer: {q.options[q.correctIndex]}. {q.explanation}
            </div>
          </div>
        ))}
      </div>

      <button className="restart-btn" onClick={onRestart}>
        Build another quiz
      </button>
    </div>
  );
}
