// ── LandingPage.jsx ───────────────────────────────────────────────────────
import { useState } from "react";
import {
  palette, PageShell, WatercolorBlob, SketchButton,
  SketchInput, WatercolorCard, Footer, SectionLabel,
} from "./Shared.jsx";

// ── Blobs for landing ─────────────────────────────────────────────────────
const BLOBS = (
  <>
    <WatercolorBlob color={palette.waterBlue}     lightColor={palette.waterBlueLight}     x="-90px" y="-70px" size={360} opacity={0.38} animIndex={0} duration={11} delay={0}   rv={0}/>
    <WatercolorBlob color={palette.waterGold}     lightColor={palette.waterGoldLight}     x="52%"   y="-50px" size={320} opacity={0.33} animIndex={1} duration={10} delay={0.5} rv={1}/>
    <WatercolorBlob color={palette.waterGreen}    lightColor={palette.waterGreenLight}    x="-60px" y="35%"   size={260} opacity={0.26} animIndex={2} duration={13} delay={1}   rv={2}/>
    <WatercolorBlob color={palette.waterRose}     lightColor={palette.waterRoseLight}     x="60%"   y="40%"   size={240} opacity={0.24} animIndex={3} duration={12} delay={2}   rv={3}/>
    <WatercolorBlob color={palette.waterBlue}     lightColor={palette.waterBlueLight}     x="25%"   y="58%"   size={180} opacity={0.16} animIndex={7} duration={15} delay={2.2} rv={1}/>
    <WatercolorBlob color={palette.waterRose}     lightColor={palette.waterRoseLight}     x="38%"   y="-20px" size={150} opacity={0.20} animIndex={6} duration={12} delay={4}   rv={2}/>
    <WatercolorBlob color={palette.waterLavender} lightColor={palette.waterLavenderLight} x="30%"   y="85%"   size={280} opacity={0.22} animIndex={0} duration={16} delay={1.8} rv={0}/>
    <WatercolorBlob color={palette.waterRose}     lightColor={palette.waterRoseLight}     x="65%"   y="82%"   size={220} opacity={0.20} animIndex={5} duration={10} delay={2}   rv={3}/>
  </>
);

const SPORES = [
  [80,  90,  palette.waterGold,     0.55, 0,   7],
  [340, 110, palette.waterRose,     0.45, 1,   9],
  [210, 52,  palette.waterBlue,     0.50, 2,   8],
  [370, 200, palette.waterGreen,    0.45, 0.5, 11],
  [30,  260, palette.waterLavender, 0.40, 1.5, 7],
  [290, 310, palette.waterGold,     0.40, 0.8, 10],
  [155, 140, palette.waterRose,     0.35, 2,   9],
  [60,  400, palette.waterBlue,     0.38, 0.3, 12],
];

// ── Wordmark with lightning-bolt logo ────────────────────────────────────
function Wordmark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36 }}>
      <svg width="56" height="56" viewBox="0 0 48 48" style={{ filter: "url(#roughBorder)" }}>
        <circle cx="24" cy="24" r="18" fill={`${palette.waterGold}66`} stroke="rgba(123,111,160,1)" strokeWidth="2.5"/>
        <path d="M26 11 L18 25 L23 25 L20 37 L30 21 L25 21 Z"
          fill={palette.waterGold} stroke="rgba(123,111,160,1)" strokeWidth="1.2" strokeLinejoin="round"
        />
      </svg>
      <div>
        <span style={{
          fontFamily: "'Caveat', cursive", fontSize: 34, fontWeight: 700,
          color: palette.inkBrown, letterSpacing: "-0.01em", fontStyle: "italic",
        }}>strike</span>
        <div style={{
          width: 8, height: 8, borderRadius: "50%", background: palette.waterRose,
          display: "inline-block", marginLeft: 4, marginBottom: 6,
          verticalAlign: "bottom", filter: "url(#sketch)",
        }} />
      </div>
    </div>
  );
}

// ── Verify badge ──────────────────────────────────────────────────────────
function VerifyBadge() {
  return (
    <div style={{
      position: "relative", display: "inline-flex", alignItems: "center",
      gap: 8, padding: "8px 20px",
      fontFamily: "'Caveat', cursive", fontSize: 15, color: "#3a2f5e",
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
        <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)"
          rx="20" fill={`${palette.waterGold}44`}
          stroke="rgba(123,111,160,0.7)" strokeWidth="1.8" style={{ filter: "url(#sketch)" }}
        />
      </svg>
      <span>🎓</span>
      <span style={{ position: "relative", zIndex: 1 }}>College students only · .edu verified</span>
    </div>
  );
}

// ── Register card ───────────────────────────────────────────────────────────
function RegisterCard({ onBack, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      setError("please fill in both fields ✦");
      return;
    }
    setError("");
    setLoading(true);

    // ── Replace this block with your real auth call ───────────────────────
    // e.g. const res = await signInWithEmailAndPassword(auth, email, password);
    // const displayName = res.user.displayName || email.split("@")[0];
    await new Promise(r => setTimeout(r, 800)); // simulated network delay
    const displayName = email.split("@")[0];    // derive name from email
    // ─────────────────────────────────────────────────────────────────────

    setLoading(false);

    // After login → go to InfoPage starting at step 1 (tags), with name pre-filled
    onNavigate("info", { initialStep: 1, initialName: displayName });
  };

  return (
    <WatercolorCard color={palette.waterRose} lightColor={palette.waterRoseLight}>
      <div style={{
        fontFamily: "'Caveat', cursive", fontSize: 22, fontWeight: 700,
        color: palette.inkBrown, textAlign: "center", marginBottom: 20, fontStyle: "italic",
      }}>Welcome back ✦</div>
      <SketchInput label="College email" placeholder="you@university.edu" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} type="email" />
      <SketchInput label="Password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} type="password" />
      {error && (
        <div style={{
          fontFamily: "'Caveat', cursive", fontSize: 14,
          color: palette.waterRose, fontStyle: "italic", marginBottom: 8,
        }}>
          ✦ {error}
        </div>
      )}
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        <SketchButton color={palette.waterGreen} lightColor={palette.waterGreenLight} onClick={handleRegister} wide disabled={loading}>
          {loading ? "registering…" : "Register →"}
        </SketchButton>
        <SketchButton color={palette.waterBlue} lightColor={palette.waterBlueLight} onClick={onBack} wide>← Back</SketchButton>
      </div>
      <div style={{
        textAlign: "center", marginTop: 14, fontFamily: "'Caveat', cursive",
        fontSize: 13, color: palette.softInk, opacity: 0.5, cursor: "pointer", textDecoration: "underline",
      }}>
      </div>
    </WatercolorCard>
  );
}

export default function Register({ onNavigate }) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <PageShell blobs={BLOBS} spores={SPORES}>

      <Wordmark />

      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{
          fontFamily: "'Caveat', cursive", fontSize: 46, fontWeight: 700,
          color: palette.inkBrown, margin: "0 0 12px", lineHeight: 1.12, letterSpacing: "-0.01em",
        }}>
          Find your people,{" "}
          <span style={{ color: palette.waterGreen, fontStyle: "italic" }}>right now.</span>
        </h1>
        <p style={{
          fontFamily: "'Caveat', cursive", fontSize: 17, color: palette.softInk,
          opacity: 0.7, margin: 0, lineHeight: 1.5, fontStyle: "italic",
        }}>
          Real hangouts with verified students near you — no feeds, just plans.
        </p>
      </div>

      {/* Verify badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <VerifyBadge />
      </div>

      <SectionLabel>get started</SectionLabel>
        <RegisterCard onNavigate={onNavigate} onBack={() => onNavigate("landing")} />
      <Footer />
    </PageShell>
  );
}