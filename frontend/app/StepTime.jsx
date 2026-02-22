// ── StepTime.jsx — Step 2: When are you free? ─────────────────────────────
import { useState } from "react";
import { palette, WatercolorCard, SketchButton } from "./Shared";

const TIMES = ["now!", "this afternoon", "this evening", "tomorrow morning", "this weekend", "whenever"];

// ── Time pill ─────────────────────────────────────────────────────────────
function TimePill({ label, selected, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", padding: "8px 18px", cursor: "pointer",
        fontFamily: "'Caveat', cursive", fontSize: 15, fontWeight: 600,
        color: selected ? "#3a2f5e" : "rgba(91,78,138,0.5)",
        background: selected
          ? `radial-gradient(ellipse at 35% 35%, ${palette.waterGreenLight} 0%, ${palette.waterGreen}55 100%)`
          : hovered ? `${palette.waterGreenLight}44` : "transparent",
        transform: selected ? "rotate(-0.3deg) scale(1.04)" : "scale(1)",
        transition: "all 0.2s ease", borderRadius: 2,
      }}
    >
      <svg style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        overflow: "visible", pointerEvents: "none",
      }}>
        <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)"
          rx="20" fill="none"
          stroke={selected ? palette.waterGreen : "rgba(133,167,92,0.35)"}
          strokeWidth={selected ? "2" : "1.5"}
          style={{ filter: "url(#sketch)" }}
        />
      </svg>
      {selected ? "✓ " : ""}{label}
    </div>
  );
}

// ── Main StepTime component ───────────────────────────────────────────────
export default function StepTime({ name, tags, onDone }) {
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <WatercolorCard color={palette.waterGreen} lightColor={palette.waterGreenLight}>
      <h2 style={{
        fontFamily: "'Caveat', cursive", fontSize: 32, fontWeight: 700,
        color: palette.inkBrown, margin: "0 0 6px", lineHeight: 1.2,
      }}>
        When are you{" "}
        <span style={{ color: palette.waterGreen, fontStyle: "italic" }}>free?</span>
      </h2>
      <p style={{
        fontFamily: "'Caveat', cursive", fontSize: 15, color: palette.softInk,
        opacity: 0.65, margin: "0 0 20px", fontStyle: "italic",
      }}>
        We&apos;ll only show you people who are free at the same time.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
        {TIMES.map(t => (
          <TimePill
            key={t}
            label={t}
            selected={selectedTime === t}
            onClick={() => setSelectedTime(t)}
          />
        ))}
      </div>
      <SketchButton
        color={palette.waterGreen}
        lightColor={palette.waterGreenLight}
        onClick={() => { if (selectedTime) onDone({ name, tags, time: selectedTime }); }}
        wide
        disabled={!selectedTime}
      >
        Find my people →
      </SketchButton>
    </WatercolorCard>
  );
}