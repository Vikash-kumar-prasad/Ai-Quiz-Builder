import { useState, useEffect, useCallback } from "react";
import {
  CheckIcon,
  XIcon,
  TimerIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "./icons.jsx";

export default function QuizScreen({
  quiz,
  current,
  selected,
  revealed,
  timerSeconds = 0,
  onPickOption,
  onNext,
}) {
  const q = quiz.questions[current];
  const totalQuestions = quiz.questions.length;
  const [timeLeft, setTimeLeft] = useState(timerSeconds);

  // Timer countdown logic
  useEffect(() => {
    if (timerSeconds <= 0) return;

    setTimeLeft(timerSeconds);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!revealed) {
            onPickOption(-1); // Timeout commits an unanswered choice
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [current, timerSeconds, revealed, onPickOption]);

  // Keyboard accessibility: 1-4 / A-D to select, Enter/Space/ArrowRight to advance
  const handleKeyDown = useCallback(
    (e) => {
      if (!revealed) {
        const key = e.key.toUpperCase();
        if (key === "A" || key === "1") onPickOption(0);
        else if (key === "B" || key === "2") onPickOption(1);
        else if (key === "C" || key === "3") onPickOption(2);
        else if (key === "D" || key === "4") onPickOption(3);
      } else {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
          e.preventDefault();
          onNext();
        }
      }
    },
    [revealed, onPickOption, onNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const progressPct = ((current + (revealed ? 1 : 0)) / totalQuestions) * 100;
  const isTimeCritical = timerSeconds > 0 && timeLeft <= 10;

  return (
    <div className="stage-enter" key={current}>
      {/* Top Header Card with Meta & Progress */}
      <div className="quiz-header">
        <div className="quiz-header-top">
          <span className="quiz-title-badge" title={quiz.title}>
            {quiz.title}
          </span>
          <div className="quiz-meta-right">
            {timerSeconds > 0 && (
              <span className={`timer-badge ${isTimeCritical ? "warning" : ""}`}>
                <TimerIcon size={14} />
                <span>{timeLeft}s</span>
              </span>
            )}
            <span className="question-counter-badge">
              Question {current + 1} of {totalQuestions}
            </span>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="progress-bar-track" aria-label={`Progress: ${Math.round(progressPct)}%`}>
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="q-card">
        <span className="q-tag">Item #{current + 1}</span>
        <h2 className="q-text">{q.question}</h2>

        {/* Options List */}
        <div
          className="opt-list"
          role="radiogroup"
          aria-label={`Options for question ${current + 1}`}
        >
          {q.options.map((opt, i) => {
            let cls = "opt-btn";
            if (revealed) {
              if (i === q.correctIndex) {
                cls += " correct";
              } else if (i === selected) {
                cls += " wrong";
              }
            }

            return (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={selected === i}
                className={cls}
                disabled={revealed}
                onClick={() => onPickOption(i)}
              >
                <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                <span style={{ flex: 1 }}>{opt}</span>
                {revealed && i === q.correctIndex && (
                  <span className="opt-icon" aria-label="Correct answer">
                    <CheckIcon size={18} />
                  </span>
                )}
                {revealed && i === selected && i !== q.correctIndex && (
                  <span className="opt-icon" aria-label="Incorrect answer">
                    <XIcon size={18} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Pedagogical Explanation */}
        {revealed && (
          <div className="explanation" role="region" aria-live="polite">
            <div className="explanation-title">
              <SparklesIcon size={14} />
              <span>Explanation & Key Insight</span>
            </div>
            <div>{q.explanation}</div>
          </div>
        )}

        {/* Action Button Row */}
        {revealed && (
          <div className="quiz-actions">
            <button className="next-btn" onClick={onNext} autoFocus>
              <span>{current + 1 < totalQuestions ? "Next Question" : "View Results"}</span>
              <ArrowRightIcon size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
