// ── InfoPage.jsx — orchestrates StepName → StepTags → StepTime ───────────
import { useState } from "react";
import {
  palette, PageShell, WatercolorBlob,
  TopBar, Footer,
} from "./Shared";
import StepName from "./StepName";
import StepTags from "./StepTags";
import StepTime from "./StepTime";
import { createProfile } from "./api.js";

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

function StepProgress({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 28 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: i === step ? 22 : 10, height: 10,
            borderRadius: i === step ? 5 : "50%",
            background: i <= step ? palette.waterBlue : palette.waterBlueLight,
            border: `1.5px solid ${i <= step ? palette.waterBlue : palette.waterBlueLight}`,
            transition: "all 0.4s ease",
            animation: i === step ? "dotPulse 2s ease-in-out infinite" : "none",
            filter: i === step ? "url(#sketch)" : "none",
          }} />
          {i < 2 && (
            <div style={{
              width: 32, height: 2,
              background: i < step ? `${palette.waterBlue}88` : palette.waterBlueLight,
              margin: "0 4px", transition: "background 0.4s ease",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── InfoPage ───────────────────────────────────────────────────────────────
// When the user finishes StepTime, we:
//  1. Request geolocation
//  2. POST /profile → get back { id }
//  3. Call onNavigate("connect", { name, tags, dateTime, id, lat, lng })
export default function InfoPage({ onNavigate, initialStep = 0, initialName = "" }) {
  const [step, setStep]   = useState(initialStep);
  const [name, setName]   = useState(initialName);
  const [tags, setTags]   = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [geoError,   setGeoError]   = useState("");

  const handleBack = () => {
    if (step === 0 || (step === 1 && initialStep === 1)) {
      onNavigate("landing");
    } else {
      setStep(s => s - 1);
    }
  };

  // Called by StepTime with { name, tags, dateTime }
  async function handleDone({ name: n, tags: t, dateTime }) {
    setSubmitting(true);
    setGeoError("");

    try {
      // 1. Get coordinates
      const coords = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
          pos => resolve(pos.coords),
          ()  => reject(new Error("Location access denied — please enable it to find nearby people."))
        )
      );

      // 2. POST profile to backend
      const { id } = await createProfile({
        name:         n,
        avatar:       "⚡",
        lat:          coords.latitude,
        lng:          coords.longitude,
        // Store as ISO string; backend will parse for ±2h window matching
        availability: dateTime.toISOString(),
        tags:         t,
        color:        palette.waterRose,
        light:        palette.waterRoseLight,
      });

      // 3. Navigate to matches, passing everything ConnectPage needs
      onNavigate("connect", {
        id,
        name:     n,
        tags:     t,
        dateTime: dateTime.toISOString(),
        lat:      coords.latitude,
        lng:      coords.longitude,
      });
    } catch (err) {
      setGeoError(err.message || "Something went wrong — please try again.");
      setSubmitting(false);
    }
  }

  return (
    <PageShell blobs={BLOBS} spores={SPORES}>
      <TopBar onBack={handleBack} />
      <StepProgress step={step} />

      {step === 0 && (
        <StepName
          onNext={(enteredName) => {
            setName(enteredName);
            setStep(1);
          }}
        />
      )}

      {step === 1 && (
        <StepTags
          name={name}
          onNext={(selectedTags) => {
            setTags(selectedTags);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <>
          <StepTime
            name={name}
            tags={tags}
            onDone={handleDone}
            disabled={submitting}
          />
          {submitting && (
            <div style={{
              fontFamily: "'Yusei Magic', sans-serif", fontSize: 15,
              color: palette.softInk, textAlign: "center",
              opacity: 0.65, marginTop: 12, fontStyle: "italic",
            }}>
              📍 getting your location & finding people…
            </div>
          )}
          {geoError && (
            <div style={{
              fontFamily:"'Yusei Magic', sans-serif", fontSize: 14,
              color: palette.waterRose, fontStyle: "italic",
              marginTop: 12, textAlign: "center",
            }}>
              ✦ {geoError}
            </div>
          )}
        </>
      )}

      <Footer />
    </PageShell>
  );
}