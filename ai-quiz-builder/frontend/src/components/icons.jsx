// Small hand-drawn SVG icons used throughout the quiz UI.
// Kept together since each one is tiny and they're all part of the same
// "chalk" visual language.

export function ChalkCheck({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 13.5 L9.5 19 L20.5 6"
        stroke="var(--chalk-yellow)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="chalk-draw"
        pathLength="1"
      />
    </svg>
  );
}

export function ChalkX({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 5 L19 19 M19 5 L5 19"
        stroke="var(--chalk-red)"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="chalk-draw"
        pathLength="1"
      />
    </svg>
  );
}

// Radiating chalk lines shown around the score ring on a high score.
export function ChalkBurst() {
  const rays = Array.from({ length: 10 });
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {rays.map((_, i) => {
        const angle = (i / rays.length) * Math.PI * 2;
        const r1 = 72, r2 = 86 + (i % 3) * 6;
        const x1 = 90 + Math.cos(angle) * r1, y1 = 90 + Math.sin(angle) * r1;
        const x2 = 90 + Math.cos(angle) * r2, y2 = 90 + Math.sin(angle) * r2;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="var(--chalk-yellow)"
            strokeWidth="2"
            strokeLinecap="round"
            className="chalk-draw"
            pathLength="1"
            style={{ animationDelay: `${0.8 + i * 0.03}s` }}
          />
        );
      })}
    </svg>
  );
}

// Circular progress ring used on the results screen to show the score %.
export function ScoreRing({ pct }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(243,239,224,0.15)" strokeWidth="6" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke="var(--chalk-yellow)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        transform="rotate(-90 70 70)"
        className="ring-draw"
        style={{ "--ring-c": c, "--ring-target": c - (pct / 100) * c }}
      />
    </svg>
  );
}

// Hand-drawn squiggle used under the hero headline on the setup screen.
export function ChalkUnderline({ width = 220 }) {
  return (
    <svg width={width} height="14" viewBox={`0 0 ${width} 14`} style={{ display: "block", marginTop: -4 }}>
      <path
        d={`M2 8 C ${width * 0.25} 2, ${width * 0.5} 12, ${width * 0.75} 5 S ${width - 8} 9, ${width - 2} 6`}
        stroke="var(--chalk-yellow)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}
