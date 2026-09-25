import { useState, useEffect } from "react";
import { BrainIcon, SparklesIcon } from "./icons.jsx";

const LOADING_STEPS = [
  "Analyzing subject concepts...",
  "Formulating questions & plausible distractors...",
  "Synthesizing pedagogical explanations...",
  "Formatting structured assessment...",
];

export default function LoadingScreen() {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-wrap stage-enter">
      <div className="loader-glow-orb">
        <div className="modern-spinner" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
        <div className="loading-text">
          <span>{LOADING_STEPS[stepIdx]}</span>
          <span className="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </span>
        </div>
        <p className="loading-subtitle">
          Generating customized assessment items via Groq AI
        </p>
      </div>
    </div>
  );
}
