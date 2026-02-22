// ── StepTags.jsx — Step 1: Pick your vibe tags ────────────────────────────
import { useState } from "react";
import { palette, SketchButton } from "./Shared";

const ALL_TAGS = [
  { label: "☕ coffee",       color: palette.waterGold,     light: palette.waterGoldLight },
  { label: "📚 studying",     color: palette.waterBlue,     light: palette.waterBlueLight },
  { label: "🎨 art",          color: palette.waterRose,     light: palette.waterRoseLight },
  { label: "🌿 outdoors",     color: palette.waterGreen,    light: palette.waterGreenLight },
  { label: "🎮 gaming",       color: palette.waterLavender, light: palette.waterLavenderLight },
  { label: "🍕 food",         color: palette.waterGold,     light: palette.waterGoldLight },
  { label: "🎵 music",        color: palette.waterRose,     light: palette.waterRoseLight },
  { label: "🏃 active",       color: palette.waterGreen,    light: palette.waterGreenLight },
  { label: "🎬 movies",       color: palette.waterBlue,     light: palette.waterBlueLight },
  { label: "📖 reading",      color: palette.waterLavender, light: palette.waterLavenderLight },
  { label: "🧘 chill",        color: palette.waterGold,     light: palette.waterGoldLight },
  { label: "🌙 night owl",    color: palette.waterBlue,     light: palette.waterBlueLight },
  { label: "☀️ early bird",   color: palette.waterGold,     light: palette.waterGoldLight },
  { label: "🐾 pets",         color: palette.waterGreen,    light: palette.waterGreenLight },
  { label: "✈️ travel",       color: palette.waterRose,     light: palette.waterRoseLight },
  { label: "💻 tech",         color: palette.waterBlue,     light: palette.waterBlueLight },
  { label: "🏋️ gym",       color: palette.waterGold,     light: palette.waterGoldLight },
  { label: "🎉 club",     color: palette.waterBlue,     light: palette.waterBlueLight },
  { label: "🎨 bar",          color: palette.waterRose,     light: palette.waterRoseLight }
];

// ── Selectable tag pill ───────────────────────────────────────────────────
function TagPill({ tag, selected, onClick, animDelay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: "7px 16px",
        cursor: "pointer",
        fontFamily: "'Yusei Magic', sans-serif", fontSize: 13, fontWeight: 600,
        color: selected ? "#3a2f5e" : "rgba(91,78,138,0.55)",
        background: selected
          ? `radial-gradient(ellipse at 35% 35%, ${tag.light} 0%, ${tag.color}66 100%)`
          : hovered ? `${tag.light}55` : "transparent",
        transform: selected
          ? "rotate(-0.5deg) scale(1.04)"
          : hovered ? "scale(1.02)" : "scale(1)",
        transition: "all 0.2s ease",
        borderRadius: 16,
        animation: `tagPop 0.4s ease ${animDelay}s both`,
      }}
    >
      <svg style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        overflow: "visible", pointerEvents: "none",
      }}>
        <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)"
          rx="20" fill="none"
          stroke={selected ? palette.softInk : "rgba(123,111,160,0.3)"}
          strokeWidth={selected ? "2" : "1.5"}
          style={{ filter: "url(#sketch)" }}
        />
      </svg>
      {tag.label}
    </div>
  );
}

// ── Main StepTags component ───────────────────────────────────────────────
export default function StepTags({ name, onNext }) {
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (label) => {
    setSelectedTags(prev =>
      prev.includes(label)
        ? prev.filter(t => t !== label)
        : prev.length < 5 ? [...prev, label] : prev
    );
  };

  return (
    <div style={{ animation: "fadeSlideUp 0.4s ease" }}>
      <h2 style={{
        fontFamily: "'Yusei Magic', sans-serif", fontSize: 32, fontWeight: 700,
        color: palette.inkBrown, margin: "0 0 6px", lineHeight: 1.2,
      }}>
        Hey {name}! What are you{" "}
        <span style={{ color: palette.waterRose, fontStyle: "italic" }}>into?</span>
      </h2>
      <p style={{
        fontFamily: "'Inconsolata', monospace", fontSize: 15, color: palette.softInk,
        opacity: 0.65, margin: "0 0 20px",
      }}>
        Pick up to 5 vibes — we&apos;ll find people who match.
      </p>

      {/* Tag card */}
      <div style={{ position: "relative", padding: "20px 16px 16px", marginBottom: 16 }}>
        <div style={{
          position: "absolute", inset: "6px 7px 7px 6px", borderRadius: "12px 14px 13px 11px",
          background: `radial-gradient(ellipse at 25% 25%, ${palette.waterGoldLight} 0%, ${palette.waterGold}33 45%, transparent 72%)`,
          filter: "url(#watercolor) blur(2px)", zIndex: 0, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: "-8px -10px -10px -8px", borderRadius: "20px",
          background: "rgba(255,255,255,0.75)", filter: "blur(6px)", zIndex: 1, pointerEvents: "none",
        }} />
        <svg style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          overflow: "visible", pointerEvents: "none", zIndex: 2,
        }}>
          <rect x="3" y="3" width="calc(100% - 6px)" height="calc(100% - 6px)"
            rx="7" fill="none" stroke="#5C4F8A" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ filter: "url(#sketch)" }}
          />
        </svg>
        <div style={{ position: "relative", zIndex: 3, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ALL_TAGS.map((tag, i) => (
            <TagPill
              key={tag.label}
              tag={tag}
              selected={selectedTags.includes(tag.label)}
              onClick={() => toggleTag(tag.label)}
              animDelay={i * 0.04}
            />
          ))}
        </div>
      </div>

      <div style={{
        fontFamily: "'Inconsolata', monospace", fontSize: 13, color: palette.softInk,
        opacity: 0.45, textAlign: "center", marginBottom: 16,
      }}>
        {selectedTags.length}/5 selected
      </div>

      <SketchButton
        color={palette.waterGreen}
        lightColor={palette.waterGreenLight}
        onClick={() => { if (selectedTags.length > 0) onNext(selectedTags); }}
        wide
        disabled={selectedTags.length === 0}
      >
        Next →
      </SketchButton>
    </div>
  );
}