import { useState } from "react";
import {
  CheckIcon,
  XIcon,
  RotateCcwIcon,
  CopyIcon,
  SparklesIcon,
  TrophyIcon,
  ScoreRing,
} from "./icons.jsx";

export default function ResultsScreen({
  quiz,
  answers,
  onRestart,
  onRetryMissed,
}) {
  const [filter, setFilter] = useState("all"); // 'all' | 'wrong' | 'correct'
  const [copied, setCopied] = useState(false);

  const total = quiz.questions.length;
  const score = answers.filter((a) => a && a.correct).length;
  const missedCount = total - score;
  const pct = Math.round((score / total) * 100);

  // Performance Tier
  let tierLabel = "Needs Practice";
  let tierColor = "var(--color-error)";
  if (pct >= 90) {
    tierLabel = "Mastery Level";
    tierColor = "var(--color-success)";
  } else if (pct >= 70) {
    tierLabel = "Proficient";
    tierColor = "var(--accent-primary)";
  } else if (pct >= 50) {
    tierLabel = "Developing";
    tierColor = "var(--color-warning)";
  }

  // Filter questions
  const filteredQuestions = quiz.questions
    .map((q, i) => ({ question: q, index: i, answer: answers[i] }))
    .filter(({ answer }) => {
      if (filter === "wrong") return !answer?.correct;
      if (filter === "correct") return !!answer?.correct;
      return true;
    });

  function handleCopyScore() {
    const text = `🏆 AI Quiz Builder Assessment Results\nQuiz: "${quiz.title}"\nScore: ${score}/${total} (${pct}% - ${tierLabel})\nTry it yourself: AI Quiz Builder`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="results-wrap stage-enter">
      {/* Top Results Card */}
      <div className="results-card">
        <div className="brand-badge" style={{ margin: "0 auto 12px auto" }}>
          <TrophyIcon size={14} />
          <span>ASSESSMENT COMPLETED</span>
        </div>

        <h1 className="headline">{quiz.title}</h1>
        <p className="sub" style={{ marginBottom: 16 }}>
          Performance Evaluation & Detailed Rationales
        </p>

        {/* Ring & Stats Grid */}
        <div className="score-display-row">
          <div className="score-ring-wrap">
            <ScoreRing pct={pct} size={150} strokeWidth={10} />
            <div className="score-center-text">
              <span className="score-num">{score}/{total}</span>
              <span className="score-pct">{pct}% Accuracy</span>
            </div>
          </div>

          <div className="score-stats-grid">
            <div className="stat-box">
              <span className="stat-label">Performance</span>
              <div className="stat-val" style={{ color: tierColor, fontSize: 17 }}>
                {tierLabel}
              </div>
            </div>
            <div className="stat-box">
              <span className="stat-label">Correct</span>
              <div className="stat-val success">{score}</div>
            </div>
            <div className="stat-box">
              <span className="stat-label">Missed</span>
              <div className="stat-val error">{missedCount}</div>
            </div>
            <div className="stat-box">
              <span className="stat-label">Questions</span>
              <div className="stat-val">{total}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="results-actions-row">
          <button className="action-btn-primary" onClick={onRestart}>
            <RotateCcwIcon size={16} />
            <span>Build Another Quiz</span>
          </button>

          {missedCount > 0 && onRetryMissed && (
            <button className="action-btn-secondary" onClick={onRetryMissed}>
              <SparklesIcon size={16} />
              <span>Retry Missed ({missedCount})</span>
            </button>
          )}

          <button className="action-btn-secondary" onClick={handleCopyScore}>
            <CopyIcon size={16} />
            <span>{copied ? "Copied to Clipboard!" : "Share Scorecard"}</span>
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Question Review</h2>
          
          {/* Filter Tabs */}
          <div className="results-filter-row" style={{ margin: 0 }}>
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All ({total})
            </button>
            <button
              className={`filter-btn ${filter === "wrong" ? "active" : ""}`}
              onClick={() => setFilter("wrong")}
            >
              Missed ({missedCount})
            </button>
            <button
              className={`filter-btn ${filter === "correct" ? "active" : ""}`}
              onClick={() => setFilter("correct")}
            >
              Correct ({score})
            </button>
          </div>
        </div>

        {/* Review Items */}
        <div style={{ marginTop: 16 }}>
          {filteredQuestions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
              No questions found for this filter.
            </div>
          ) : (
            filteredQuestions.map(({ question: q, index: i, answer }) => {
              const isCorrect = answer?.correct;
              const userPickIndex = answer?.selected;

              return (
                <div key={i} className="review-item">
                  <div className="review-q">
                    <span className={`review-status-icon ${isCorrect ? "correct" : "wrong"}`}>
                      {isCorrect ? <CheckIcon size={18} /> : <XIcon size={18} />}
                    </span>
                    <span style={{ flex: 1 }}>
                      <strong>#{i + 1}.</strong> {q.question}
                    </span>
                  </div>

                  <div className="review-answer-row">
                    {!isCorrect && userPickIndex !== undefined && userPickIndex >= 0 && (
                      <div className="user-answer">
                        Your answer: {String.fromCharCode(65 + userPickIndex)}. {q.options[userPickIndex]}
                      </div>
                    )}
                    {!isCorrect && (userPickIndex === undefined || userPickIndex < 0) && (
                      <div className="user-answer">
                        Your answer: <em>Time expired / Unanswered</em>
                      </div>
                    )}
                    <div className="correct-answer">
                      Correct answer: {String.fromCharCode(65 + q.correctIndex)}. {q.options[q.correctIndex]}
                    </div>
                  </div>

                  <div className="review-explain">
                    <strong>Rationale:</strong> {q.explanation}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
