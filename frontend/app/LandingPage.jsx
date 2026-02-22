// ── LandingPage.jsx ───────────────────────────────────────────────────────
import { useState } from "react";
import React from 'react';
const logoName = require("../assets/images/logoName.png");

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
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 25 }}>
      <img
        src={logoName.uri}
        alt="Strike"
        style={{ width: 100, height: 100 }}
      /> 
      
    </div>
  
  );
}

// ── Verify badge ──────────────────────────────────────────────────────────
function VerifyBadge() {
  return (
    <div style={{
      position: "relative", display: "inline-flex", alignItems: "center",
      gap: 8, padding: "8px 20px",
      fontFamily: "'Yusei Magic', sans-serif", fontSize: 12, color: "#3a2f5e",
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
        <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)"
          rx="20" fill={`${palette.waterGreen}44`}
          stroke="palette.softInk" strokeWidth="1.8" style={{ filter: "url(#sketch)" }}
        />
      </svg>
      <span>🎓</span>
      <span style={{ position: "relative", zIndex: 1 }}>College students only  .edu verified</span>
    </div>
  );
}

// ── Login card ────────────────────────────────────────────────────────────
function LoginCard({ onBack, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
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
        fontFamily: "'Yusei Magic', sans-serif", fontSize: 22, fontWeight: 700,
        color: palette.inkBrown, textAlign: "center", marginBottom: 20,
      }}>Welcome back ✦</div>
      <SketchInput label="College email" placeholder="you@university.edu" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} type="email" />
      <SketchInput label="Password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} type="password" />
      {error && (
        <div style={{
          fontFamily: "'Yusei Magic', sans-serif", fontSize: 14,
          color: palette.waterRose, fontStyle: "italic", marginBottom: 8,
        }}>
          ✦ {error}
        </div>
      )}
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        <SketchButton color={palette.waterGreen} lightColor={palette.waterGreenLight} onClick={handleLogin} wide disabled={loading}>
          {loading ? "logging in…" : "Log in →"}
        </SketchButton>
        <SketchButton color={palette.waterBlue} lightColor={palette.waterBlueLight} onClick={onBack} wide>← Back</SketchButton>
      </div>
     <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        // gap: 40, // space between them
        marginTop: 14,
        fontFamily: "'Yusei Magic', sans-serif",
        fontSize: 13,
        color: palette.softInk,
        opacity: 0.5,
      }}
    >
      <div
        style={{ cursor: "pointer", textDecoration: "underline" }}
        onClick={() => console.log("Forgot password")}
      >
        Forgot password?
      </div>

      <div
        style={{ cursor: "pointer", textDecoration: "underline" }}
        onClick={() => onNavigate("register")} // Navigate to the Register page
      >
        Register
      </div>
    </div>
    </WatercolorCard>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────
export default function LandingPage({ onNavigate }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <PageShell blobs={BLOBS} spores={SPORES}>

      <Wordmark />

      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{
          fontFamily: "'Yusei Magic', sans-serif", fontSize: 46, fontWeight: 700,
          color: palette.ink, margin: "0 0 12px", lineHeight: 1.12, letterSpacing: "-0.01em",
        }}>
          Find your people,{" "}
          <span style={{ color: palette.waterBlue, fontStyle: "italic" }}>right now.</span>
        </h1>
        <p style={{
          fontFamily: "'Inconsolata', monospace", fontSize: 15, color: palette.softInk,
          opacity: 0.7, margin: 0, lineHeight: 1.5,
        }}>
          Real hangouts with verified students near you — no feeds, just plans.
        </p>
      </div>

      {/* Verify badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <VerifyBadge />
      </div>

      <SectionLabel>get started</SectionLabel>

      {!showLogin ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SketchButton
            color={palette.waterGold}
            lightColor={palette.waterGold}
            onClick={() => onNavigate("verify")}
            wide
          >
            ⚡ I am down to hang
          </SketchButton>
          <SketchButton
            color={palette.waterBlue}
            lightColor={palette.waterBlueLight}
            onClick={() => setShowLogin(true)}
            wide
          >
            Log in
          </SketchButton>
        </div>
      ) : (
        <LoginCard onBack={() => setShowLogin(false)} onNavigate={onNavigate} />
      )}

      <Footer />
    </PageShell>
  );
}