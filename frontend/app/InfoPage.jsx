// ── InfoPage.jsx — name, vibe tags, availability ──────────────────────────
import { useState } from "react";
import {
  palette, PageShell, WatercolorBlob, SketchButton, SketchInput,
  WatercolorCard, TopBar, Footer, SectionLabel,
} from "./Shared";

const BLOBS = (
  <>
    <WatercolorBlob color={palette.waterGold}     lightColor={palette.waterGoldLight}     x="-80px" y="-60px" size={320} opacity={0.32} animIndex={1} duration={12} delay={0}   rv={1}/>
    <WatercolorBlob color={palette.waterGreen}    lightColor={palette.waterGreenLight}    x="55%"   y="-40px" size={280} opacity={0.28} animIndex={0} duration={14} delay={1}   rv={2}/>
    <WatercolorBlob color={palette.waterBlue}     lightColor={palette.waterBlueLight}     x="-50px" y="40%"   size={240} opacity={0.24} animIndex={3} duration={11} delay={0.5} rv={0}/>
    <WatercolorBlob color={palette.waterRose}     lightColor={palette.waterRoseLight}     x="62%"   y="50%"   size={260} opacity={0.22} animIndex={2} duration={15} delay={2}   rv={3}/>
    <WatercolorBlob color={palette.waterGold}     lightColor={palette.waterGoldLight}     x="20%"   y="75%"   size={300} opacity={0.18} animIndex={6} duration={13} delay={1.5} rv={4}/>
    <WatercolorBlob color={palette.waterLavender} lightColor={palette.waterLavenderLight} x="-30px" y="70%"   size={200} opacity={0.20} animIndex={5} duration={16} delay={3}   rv={1}/>
    <WatercolorBlob color={palette.waterGreenLight} lightColor={palette.waterGoldLight}   x="10%"   y="20%"   size={380} opacity={0.11} animIndex={7} duration={19} delay={0}   rv={3}/>
  </>
);

const SPORES = [
  [60,  80,  palette.waterGold,     0.50, 0,   8],
  [360, 130, palette.waterGreen,    0.40, 1.2, 9],
  [180, 60,  palette.waterRose,     0.45, 0.5, 7],
  [30,  300, palette.waterBlue,     0.38, 2,   11],
  [340, 280, palette.waterGold,     0.35, 0.8, 10],
  [120, 450, palette.waterLavender, 0.35, 1.5, 8],
  [300, 500, palette.waterGreen,    0.30, 2.5, 12],
];

// ── All available vibe tags ───────────────────────────────────────────────
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
];

const TIMES = ["now!", "this afternoon", "this evening", "tomorrow morning", "this weekend", "whenever"];

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
        fontFamily: "'Caveat', cursive", fontSize: 15, fontWeight: 600,
        color: selected ? "#3a2f5e" : "rgba(91,78,138,0.55)",
        background: selected
          ? `radial-gradient(ellipse at 35% 35%, ${tag.light} 0%, ${tag.color}66 100%)`
          : hovered ? `${tag.light}55` : "transparent",
        transform: selected
          ? "rotate(-0.5deg) scale(1.04)"
          : hovered ? "scale(1.02)" : "scale(1)",
        transition: "all 0.2s ease",
        borderRadius: 2,
        animation: `tagPop 0.4s ease ${animDelay}s both`,
      }}
    >
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
        <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)"
          rx="20" fill="none"
          stroke={selected ? "#5C4F8A" : "rgba(123,111,160,0.3)"}
          strokeWidth={selected ? "2" : "1.5"}
          style={{ filter: "url(#sketch)" }}
        />
      </svg>
      {tag.label}
    </div>
  );
}

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
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
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

// ── Progress bar ──────────────────────────────────────────────────────────
function StepProgress({ step }) {
  // step: 0=name, 1=tags, 2=time
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 28 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: i === step ? 22 : 10, height: 10,
            borderRadius: i === step ? 5 : "50%",
            background: i <= step ? palette.waterGreen : "rgba(163,201,136,0.25)",
            border: `1.5px solid ${i <= step ? palette.waterGreen : "rgba(163,201,136,0.4)"}`,
            transition: "all 0.4s ease",
            animation: i === step ? "dotPulse 2s ease-in-out infinite" : "none",
            filter: i === step ? "url(#sketch)" : "none",
          }} />
          {i < 2 && (
            <div style={{
              width: 32, height: 2,
              background: i < step ? `${palette.waterGreen}88` : "rgba(163,201,136,0.2)",
              margin: "0 4px", transition: "background 0.4s ease",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Info/Tags Page ───────────────────────────────────────────────────
export default function InfoPage({ onNavigate }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [nameError, setNameError] = useState("");

  const toggleTag = (label) => {
    setSelectedTags(prev =>
      prev.includes(label)
        ? prev.filter(t => t !== label)
        : prev.length < 5 ? [...prev, label] : prev
    );
  };

  const handleNameNext = () => {
    if (!name.trim()) { setNameError("what should we call you?"); return; }
    setNameError("");
    setStep(1);
  };

  const handleTagsNext = () => {
    if (selectedTags.length === 0) return;
    setStep(2);
  };

  const handleDone = () => {
    if (!selectedTime) return;
    onNavigate("connect", { name, tags: selectedTags, time: selectedTime });
  };

  return (
    <PageShell blobs={BLOBS} spores={SPORES}>
      <TopBar onBack={() => step === 0 ? onNavigate("landing") : setStep(s => s - 1)} />
      <StepProgress step={step} />

      {/* ── STEP 0: Name ── */}
      {step === 0 && (
        <WatercolorCard color={palette.waterBlue} lightColor={palette.waterBlueLight}>
          <h2 style={{
            fontFamily: "'Caveat', cursive", fontSize: 32, fontWeight: 700,
            color: palette.inkBrown, margin: "0 0 8px", lineHeight: 1.2,
          }}>
            First, what&apos;s your{" "}
            <span style={{ color: palette.waterBlue, fontStyle: "italic" }}>name?</span>
          </h2>
          <p style={{
            fontFamily: "'Caveat', cursive", fontSize: 15, color: palette.softInk,
            opacity: 0.65, margin: "0 0 20px", fontStyle: "italic",
          }}>
            This is how you&apos;ll appear to others nearby.
          </p>
          <SketchInput
            label="Your first name"
            placeholder="e.g. Maya"
            value={name}
            onChange={e => { setName(e.target.value); setNameError(""); }}
            hasError={!!nameError}
          />
          {nameError && (
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: palette.waterRose, fontStyle: "italic", marginBottom: 8 }}>
              ✦ {nameError}
            </div>
          )}
          <SketchButton color={palette.waterGreen} lightColor={palette.waterGreenLight} onClick={handleNameNext} wide>
            Next →
          </SketchButton>
        </WatercolorCard>
      )}

      {/* ── STEP 1: Tags ── */}
      {step === 1 && (
        <div style={{ animation: "fadeSlideUp 0.4s ease" }}>
          <h2 style={{
            fontFamily: "'Caveat', cursive", fontSize: 32, fontWeight: 700,
            color: palette.inkBrown, margin: "0 0 6px", lineHeight: 1.2,
          }}>
            Hey {name}! What are you{" "}
            <span style={{ color: palette.waterRose, fontStyle: "italic" }}>into?</span>
          </h2>
          <p style={{
            fontFamily: "'Caveat', cursive", fontSize: 15, color: palette.softInk,
            opacity: 0.65, margin: "0 0 20px", fontStyle: "italic",
          }}>
            Pick up to 5 vibes — we&apos;ll find people who match.
          </p>

          <div style={{ position: "relative", padding: "20px 16px 16px", marginBottom: 16 }}>
            {/* Card wash */}
            <div style={{
              position: "absolute", inset: "6px 7px 7px 6px", borderRadius: "12px 14px 13px 11px",
              background: `radial-gradient(ellipse at 25% 25%, ${palette.waterGoldLight} 0%, ${palette.waterGold}33 45%, transparent 72%)`,
              filter: "url(#watercolor) blur(2px)", zIndex: 0, pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", inset: "-8px -10px -10px -8px", borderRadius: "20px",
              background: "rgba(255,255,255,0.75)", filter: "blur(6px)", zIndex: 1, pointerEvents: "none",
            }} />
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 2 }}>
              <rect x="3" y="3" width="calc(100% - 6px)" height="calc(100% - 6px)"
                rx="7" fill="none" stroke="#5C4F8A" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" style={{ filter: "url(#sketch)" }}
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
            fontFamily: "'Caveat', cursive", fontSize: 13, color: palette.softInk,
            opacity: 0.45, textAlign: "center", marginBottom: 16,
          }}>
            {selectedTags.length}/5 selected
          </div>

          <SketchButton
            color={palette.waterGreen} lightColor={palette.waterGreenLight}
            onClick={handleTagsNext} wide disabled={selectedTags.length === 0}
          >
            Next →
          </SketchButton>
        </div>
      )}

      {/* ── STEP 2: Time ── */}
      {step === 2 && (
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
                key={t} label={t}
                selected={selectedTime === t}
                onClick={() => setSelectedTime(t)}
              />
            ))}
          </div>
          <SketchButton
            color={palette.waterGreen} lightColor={palette.waterGreenLight}
            onClick={handleDone} wide disabled={!selectedTime}
          >
            Find my people →
          </SketchButton>
        </WatercolorCard>
      )}

      <Footer />
    </PageShell>
  );
}