import { ChalkCheck, ChalkX } from "./icons.jsx";

// The main quiz-taking screen — shows one question at a time, reveals
// correct/incorrect on selection, then an explanation and a next button.
export default function QuizScreen({ quiz, current, selected, revealed, onPickOption, onNext }) {
  const q = quiz.questions[current];

  const tally = quiz.questions.map((_, i) => (
    <div key={i} className={`tally-mark ${i <= current ? "done" : ""}`} />
  ));

  return (
    <div className="stage-enter" key={current}>
      <div className="progress-row">
        <span>{quiz.title}</span>
        <span>Question {current + 1} / {quiz.questions.length}</span>
      </div>
      <div className="progress-row" style={{ marginTop: -10, marginBottom: 20 }}>
        <div className="tally">{tally}</div>
        <span></span>
      </div>

      <div className="q-card">
        <p className="q-text">{q.question}</p>
        <div className="opt-list">
          {q.options.map((opt, i) => {
            let cls = "opt-btn";
            if (revealed) {
              if (i === q.correctIndex) cls += " correct";
              else if (i === selected) cls += " wrong";
            }
            return (
              <button key={i} className={cls} disabled={revealed} onClick={() => onPickOption(i)}>
                <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
                {revealed && i === q.correctIndex && (
                  <span className="opt-icon"><ChalkCheck size={18} /></span>
                )}
                {revealed && i === selected && i !== q.correctIndex && (
                  <span className="opt-icon"><ChalkX size={18} /></span>
                )}
              </button>
            );
          })}
        </div>

        {revealed && <div className="explanation">{q.explanation}</div>}

        {revealed && (
          <button className="next-btn" onClick={onNext}>
            {current + 1 < quiz.questions.length ? "Next question →" : "See results →"}
          </button>
        )}
        <div style={{ clear: "both" }} />
      </div>
    </div>
  );
}
