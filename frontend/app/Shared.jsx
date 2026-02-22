// ── shared.js — palette, filters, animations, shared components ──────────
import { useState } from "react";

export const palette = {
  inkBrown:           "#7B6FA0",
  softInk:            "#7B6FA0",
  waterBlue:          "#A6C1DC",
  waterBlueLight:     "#D4E6F3",
  waterGreen:         "#85A75C",
  waterGreenLight:    "#A3C988",
  waterRose:          "#C798C1",
  waterRoseLight:     "#FBDBF3",
  waterGold:          "#F4DC81",
  waterGoldLight:     "#FAF0C0",
  waterLavender:      "#C798C1",
  waterLavenderLight: "#FBDBF3",
  ink:                "#33316e",
};

export const animationCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Covered+By+Your+Grace&family=Inconsolata:wght@200..900&family=Yusei+Magic&display=swap');

  @keyframes blobDrift0 {
    0%   { transform: translate(0px,0px) scale(1) rotate(0deg); }
    33%  { transform: translate(18px,-22px) scale(1.06) rotate(2deg); }
    66%  { transform: translate(-12px,14px) scale(0.96) rotate(-1.5deg); }
    100% { transform: translate(0px,0px) scale(1) rotate(0deg); }
  }
  @keyframes blobDrift1 {
    0%   { transform: translate(0px,0px) scale(1) rotate(0deg); }
    33%  { transform: translate(-20px,16px) scale(1.08) rotate(-2deg); }
    66%  { transform: translate(14px,-10px) scale(0.94) rotate(1deg); }
    100% { transform: translate(0px,0px) scale(1) rotate(0deg); }
  }
  @keyframes blobDrift2 {
    0%   { transform: translate(0px,0px) scale(1); }
    50%  { transform: translate(22px,18px) scale(1.05); }
    100% { transform: translate(0px,0px) scale(1); }
  }
  @keyframes blobDrift3 {
    0%   { transform: translate(0px,0px) scale(1) rotate(0deg); }
    40%  { transform: translate(-16px,-20px) scale(1.07) rotate(3deg); }
    80%  { transform: translate(10px,12px) scale(0.97) rotate(-2deg); }
    100% { transform: translate(0px,0px) scale(1) rotate(0deg); }
  }
  @keyframes blobDrift4 {
    0%   { transform: translate(0px,0px) scale(1); }
    30%  { transform: translate(24px,-14px) scale(1.04); }
    70%  { transform: translate(-8px,20px) scale(0.98); }
    100% { transform: translate(0px,0px) scale(1); }
  }
  @keyframes blobDrift5 {
    0%   { transform: translate(0px,0px) scale(1) rotate(0deg); }
    45%  { transform: translate(-18px,22px) scale(1.06) rotate(-3deg); }
    90%  { transform: translate(12px,-8px) scale(0.95) rotate(2deg); }
    100% { transform: translate(0px,0px) scale(1) rotate(0deg); }
  }
  @keyframes blobDrift6 {
    0%   { transform: translate(0px,0px) scale(1); }
    35%  { transform: translate(20px,16px) scale(1.09); }
    70%  { transform: translate(-14px,-18px) scale(0.93); }
    100% { transform: translate(0px,0px) scale(1); }
  }
  @keyframes blobDrift7 {
    0%   { transform: translate(0px,0px) scale(1) rotate(0deg); }
    50%  { transform: translate(-22px,-12px) scale(1.05) rotate(4deg); }
    100% { transform: translate(0px,0px) scale(1) rotate(0deg); }
  }
  @keyframes sporeFloat {
    0%   { transform: translateY(0px) scale(1); opacity: 0.45; }
    50%  { transform: translateY(-14px) scale(1.15); opacity: 0.65; }
    100% { transform: translateY(0px) scale(1); opacity: 0.45; }
  }
  @keyframes shakeX {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-10px); }
    40%     { transform: translateX(10px); }
    60%     { transform: translateX(-6px); }
    80%     { transform: translateX(6px); }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    0%   { opacity: 0; transform: scale(0.88); }
    70%  { transform: scale(1.04); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes dotPulse {
    0%,100% { transform: scale(1); opacity: 0.6; }
    50%     { transform: scale(1.35); opacity: 8; }
  }
  @keyframes tagPop {
    0%   { opacity: 0; transform: scale(0.7) rotate(-4deg); }
    70%  { transform: scale(1.08) rotate(1deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(24px) rotate(var(--card-rot, 0deg)); }
    to   { opacity: 1; transform: translateY(0) rotate(var(--card-rot, 0deg)); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1); opacity: 0.7; }
    70%  { transform: scale(1.6); opacity: 0; }
    100% { transform: scale(1.6); opacity: 0; }
  }
`;

export const sketchFilter = `
  <svg width="0" height="0" style="position:absolute">
    <defs>
      <filter id="sketch" x="-25%" y="-25%" width="150%" height="150%">
        <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="6" seed="12" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" seed="3" result="grain"/>
        <feComposite in="displaced" in2="grain" operator="in" result="textured"/>
        <feBlend in="displaced" in2="textured" mode="multiply"/>
      </filter>
      <filter id="watercolor" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="4" seed="5" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
        <feGaussianBlur in="displaced" stdDeviation="1.5" result="blurred"/>
        <feBlend in="blurred" in2="SourceGraphic" mode="multiply"/>
      </filter>
      <filter id="roughBorder" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" seed="17" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="4.5" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="7" result="grain"/>
        <feBlend in="displaced" in2="grain" mode="multiply"/>
      </filter>
    </defs>
  </svg>
`;

const blobRadii = [
  "60% 40% 70% 30% / 50% 60% 40% 70%",
  "40% 60% 30% 70% / 60% 40% 70% 50%",
  "70% 30% 50% 60% / 40% 70% 30% 60%",
  "55% 45% 65% 35% / 45% 65% 35% 55%",
  "35% 65% 55% 45% / 65% 35% 55% 45%",
];

export function WatercolorBlob({ color, lightColor, x, y, size, opacity = 0.35, animIndex = 0, duration = 9, delay = 0, rv = 0 }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size * 0.82,
      background: `radial-gradient(ellipse at 38% 38%, ${lightColor} 0%, ${color} 52%, transparent 75%)`,
      borderRadius: blobRadii[rv % blobRadii.length],
      opacity, filter: "url(#watercolor) blur(2.5px)",
      pointerEvents: "none",
      animation: `blobDrift${animIndex % 8} ${duration}s ease-in-out ${delay}s infinite`,
      willChange: "transform",
    }} />
  );
}

export function Spores({ list }) {
  return list.map(([x, y, color, opacity, delay, dur], i) => (
    <div key={i} style={{
      position: "absolute", left: x, top: y,
      width: 5 + (i % 4) * 2, height: 5 + (i % 4) * 2,
      borderRadius: "50%", background: color, opacity,
      pointerEvents: "none", zIndex: 0,
      animation: `sporeFloat ${dur}s ease-in-out ${delay}s infinite`,
      willChange: "transform",
    }} />
  ));
}

export function PageShell({ children, blobs, spores }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "'Caveat', cursive", position: "relative", overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: animationCSS }} />
      <div dangerouslySetInnerHTML={{ __html: sketchFilter }} />
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
      }} />
      {blobs}
      {spores && <Spores list={spores} />}
    <div style={{
      position: "relative",
      zIndex: 1,
      maxWidth: 420,
      margin: "0 auto",
      padding: "40px 24px 120px", // extra bottom padding helps
    }}>
        {children}
      </div>
    </div>
  );
}

export function SketchButton({ children, color = palette.waterBlue, lightColor = palette.waterBlueLight, onClick, wide = false, disabled = false, active = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        position: "relative",
        padding: wide ? "14px 0" : "10px 28px",
        width: wide ? "100%" : "auto",
        background: disabled
          ? "rgba(200,200,200,0.15)"
          : (hovered || active)
            ? `radial-gradient(ellipse at 40% 40%, ${lightColor} 0%, ${color}88 100%)`
            : `radial-gradient(ellipse at 40% 40%, ${lightColor}55 0%, ${color}33 100%)`,
        border: "none", cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'Yusei Magic', sans-serif", fontSize: "15px", fontWeight: 700,
        color: disabled ? "#aaa" : "#3a2f5e",
        transform: hovered && !disabled ? "rotate(-0.4deg) scale(1.02)" : "rotate(0.2deg)",
        transition: "all 0.2s ease", outline: "none", borderRadius: 16,
        letterSpacing: "0.02em", opacity: disabled ? 0.5 : 1,
      }}
    >
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
        <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)"
          rx="16" fill="none" stroke={disabled ? "#ccc" : "#5C4F8A"} strokeWidth="2.2"
          strokeLinejoin="round" strokeLinecap="round" style={{ filter: "url(#sketch)" }}
        />
      </svg>
      {children}
    </button>
  );
}

export function SketchInput({ placeholder, value, onChange, type = "text", label, hasError = false }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%", marginBottom: 16 }}>
      {label && (
        <div style={{
          fontFamily: "'Inconsolata', monospace", fontSize: 13, color: palette.softInk,
          opacity: 0.55, letterSpacing: "0.10em", textTransform: "uppercase",
          marginBottom: 4, paddingLeft: 2,
        }}>{label}</div>
      )}
      <style>{`
        input::placeholder {
          color: #C798C1;
          opacity: 0.8;
        }
      `}</style>
      <input
        value={value} onChange={onChange} placeholder={placeholder} type={type}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "11px 14px",
          background: focused ? `${palette.waterBlueLight}44` : "transparent",
          border: "none",
          borderBottom: `2.5px solid ${hasError ? palette.waterRose : focused ? palette.waterBlue : "rgba(123,111,160,0.9)"}`,
          fontFamily: "'Inconsolata', monospace", fontSize: "17px",
          color: "#b16296", outline: "none",
          transition: "all 0.2s ease",
          borderRadius: focused ? "4px 4px 0 0" : "0",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export function WatercolorCard({ children, color, lightColor, shake = false, rotation = 0 }) {
  return (
    <div style={{
      position: "relative", padding: "28px 24px 24px",
      width: "100%", boxSizing: "border-box",
      animation: shake ? "shakeX 0.35s ease" : "fadeSlideUp 0.4s ease",
    }}>
      <div style={{
        position: "absolute", inset: "6px 7px 7px 6px",
        borderRadius: "12px 14px 13px 11px",
        background: `
          radial-gradient(ellipse at 25% 25%, ${lightColor} 0%, ${color}55 45%, transparent 72%),
          radial-gradient(ellipse at 80% 75%, ${lightColor}BB 0%, ${color}33 40%, transparent 65%),
          radial-gradient(ellipse at 60% 10%, ${lightColor}99 0%, transparent 50%)
        `,
        filter: "url(#watercolor) blur(2px)",
        zIndex: 0, pointerEvents: "none",
      
      }} />
      <div style={{
        position: "absolute", inset: "-10px -12px -12px -10px",
        borderRadius: "20px 24px 22px 18px",
        background: "rgba(255,255,255,0.75)",
        filter: "blur(6px)", zIndex: 1, pointerEvents: "none",
      }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 2 }}>
        <rect x="3" y="3" width="calc(100% - 6px)" height="calc(100% - 6px)"
          rx="7" fill="none" stroke="#5C4F8A" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round" style={{ filter: "url(#sketch)" }}
        />
      </svg>
      <div style={{ position: "relative", zIndex: 3 }}>{children}</div>
    </div>
  );
}

export function TopBar({ onBack, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
      {onBack ? (
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Inconsolata', monospace", fontSize: 16,
          color: palette.waterGreen, fontWeight: 700,
        }}>← Back</button>
      ) : <div style={{ width: 60 }} />}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <img
          src={require("../assets/images/logo.png").uri}
          alt="Strike"
          style={{ width: 100, height: 100, objectFit: "contain" }}
        />
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: palette.waterRose, marginBottom: 2,
          filter: "url(#sketch)",
        }} />
      </div>
      {title ? (
        <div style={{ fontFamily: "'Yusei Magic', sans-serif", fontSize: 13, color: palette.softInk, opacity: 0.5 }}>{title}</div>
      ) : <div style={{ width: 60 }} />}
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'Yusei Magic', sans-serif", fontSize: 11, color: "#b16296",
      opacity: 0.7, letterSpacing: "0.12em", textTransform: "uppercase",
      marginBottom: 12, paddingLeft: 2,
    }}>{children} ˖°</div>
  );
}

export function Footer() {
  return (
    <div style={{
      marginTop: 44, textAlign: "center",
      fontFamily: "'Yusei Magic', sans-serif", fontSize: 14,
      color: "#a6c1dc", opacity: 1, fontStyle: "italic",
    }}>
      ~ safe · local · spontaneous ~
    </div>
  );
}

export default function Shared() { return null; }