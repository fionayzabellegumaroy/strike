// ── StepName.jsx — Step 0: Enter your name ────────────────────────────────
import { useState } from "react";
import {
  palette, WatercolorCard, SketchInput, SketchButton,
} from "./Shared";

export default function StepName({ onNext }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const handleNext = () => {
    if (!name.trim()) { setNameError("what should we call you?"); return; }
    setNameError("");
    onNext(name.trim());
  };

  return (
    <WatercolorCard color={palette.waterBlue} lightColor={palette.waterBlueLight}>
      <h2 style={{
        fontFamily: "'Yusei Magic', sans-serif", fontSize: 32, fontWeight: 700,
        color: palette.ink, margin: "0 0 8px", lineHeight: 1.2,
      }}>
        First, what&apos;s your{" "}
        <span style={{ color: palette.waterBlue, fontStyle: "italic" }}>name?</span>
      </h2>
      <p style={{
        fontFamily: "'Inconsolata', monospace", fontSize: 15, color: palette.softInk,
        opacity: 0.65, margin: "0 0 20px",
      }}>
        This is how you&apos;ll appear to others nearby.
      </p>
      <SketchInput
        //label="Your first name"
        placeholder="Your first name"
        value={name}
        onChange={e => { setName(e.target.value); setNameError(""); }}
        hasError={!!nameError}
      />
      {nameError && (
        <div style={{
          fontFamily: "'Inconsolata', monospace", fontSize: 14,
          color: palette.waterRose, fontStyle: "italic", marginBottom: 8,
        }}>
          ✦ {nameError}
        </div>
      )}
      <SketchButton
        color={palette.waterGreen}
        lightColor={palette.waterGreenLight}
        onClick={handleNext}
        wide
      >
        Next →
      </SketchButton>
    </WatercolorCard>
  );
}