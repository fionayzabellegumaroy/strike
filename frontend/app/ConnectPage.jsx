// ── ConnectPage.jsx — browse matches, send a strike ──────────────────────
import { useState, useEffect, useCallback } from "react";
import {
  palette, PageShell, WatercolorBlob, SketchButton,
  WatercolorCard, TopBar, Footer, SectionLabel,
} from "./Shared";
import { createGroup, fetchMatches, sendNudge } from "./api.js";

const BLOBS = (
  <>
    <WatercolorBlob color={palette.waterGreen}    lightColor={palette.waterGreenLight}    x="-80px" y="-60px" size={300} opacity={0.32} animIndex={2} duration={13} delay={0}   rv={2}/>
    <WatercolorBlob color={palette.waterRose}     lightColor={palette.waterRoseLight}     x="55%"   y="-40px" size={280} opacity={0.28} animIndex={1} duration={11} delay={0.5} rv={3}/>
    <WatercolorBlob color={palette.waterBlue}     lightColor={palette.waterBlueLight}     x="-50px" y="38%"   size={240} opacity={0.24} animIndex={0} duration={14} delay={1}   rv={0}/>
    <WatercolorBlob color={palette.waterGold}     lightColor={palette.waterGoldLight}     x="60%"   y="45%"   size={260} opacity={0.22} animIndex={3} duration={12} delay={2}   rv={1}/>
    <WatercolorBlob color={palette.waterGreen}    lightColor={palette.waterGreenLight}    x="15%"   y="68%"   size={320} opacity={0.18} animIndex={6} duration={16} delay={1.5} rv={4}/>
    <WatercolorBlob color={palette.waterRose}     lightColor={palette.waterRoseLight}     x="65%"   y="80%"   size={200} opacity={0.20} animIndex={5} duration={10} delay={2.5} rv={2}/>
    <WatercolorBlob color={palette.waterLavender} lightColor={palette.waterLavenderLight} x="5%"    y="85%"   size={250} opacity={0.18} animIndex={7} duration={15} delay={3}   rv={0}/>
    <WatercolorBlob color={palette.waterBlueLight} lightColor={palette.waterGoldLight}    x="20%"   y="25%"   size={360} opacity={0.10} animIndex={4} duration={20} delay={0}   rv={3}/>
  </>
);

const SPORES = [
  [70,  100, palette.waterGreen,    0.50, 0,   8],
  [350, 120, palette.waterRose,     0.40, 1,   9],
  [200, 55,  palette.waterBlue,     0.45, 2,   7],
  [380, 210, palette.waterGold,     0.40, 0.5, 11],
  [25,  270, palette.waterLavender, 0.38, 1.5, 8],
  [300, 320, palette.waterGreen,    0.35, 0.8, 10],
  [140, 460, palette.waterRose,     0.32, 2,   9],
  [50,  500, palette.waterBlue,     0.30, 0.3, 12],
];

// Map DB color values → watercolor palette pairs for card rendering
const COLOR_PAIRS = [
  { color: palette.waterRose,     light: palette.waterRoseLight },
  { color: palette.waterBlue,     light: palette.waterBlueLight },
  { color: palette.waterGreen,    light: palette.waterGreenLight },
  { color: palette.waterGold,     light: palette.waterGoldLight },
  { color: palette.waterLavender, light: palette.waterLavenderLight },
];

function getColorPair(dbColor) {
  // Try to match to a palette color; fall back to a deterministic pick
  const match = COLOR_PAIRS.find(p => p.color === dbColor);
  if (match) return match;
  // Hash the color string to pick consistently
  const idx = [...(dbColor || "")].reduce((a, c) => a + c.charCodeAt(0), 0) % COLOR_PAIRS.length;
  return COLOR_PAIRS[idx];
}

// ── Pulse ring ────────────────────────────────────────────────────────────
function PulseRing({ color }) {
  return (
    <div style={{ position: "relative", width: 10, height: 10, display: "inline-block", marginRight: 6 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, animation: "pulseRing 2s ease-out infinite" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color }} />
    </div>
  );
}

function GroupModal({ onClose, onConfirm, onNavigate }) {
  const [mode, setMode] = useState("one"); // "one" or "group"
  const [groupSize, setGroupSize] = useState(2);

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={titleStyle}>
          How do you want to hang out?
        </h2>

        {/* Option buttons */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, justifyContent: "center" }}>
          {/* <button
            onClick={() => setMode("one")}
            style={optionButton(mode === "one")}
          >
            1-on-1
          </button> */}

          <SketchButton
            onClick={() => setMode("group")}
            style={optionButton(mode === "group")}
          >
            Group
          </SketchButton>
        </div>

        {/* Group size selector */}
        {mode === "group" && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 8 }}>How many people?</div>

           <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <SketchButton
              onClick={() => setGroupSize(prev => Math.max(2, prev - 1))}
              disabled={groupSize == 2}
            >
              −
            </SketchButton>

            <div style={{ fontSize: 20, minWidth: 30, textAlign: "center" }}>
              {groupSize}
            </div>

            <SketchButton
              onClick={() => setGroupSize(prev => Math.min(10, prev + 1))}
              disabled={groupSize == 10}
            >
              +
            </SketchButton>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <SketchButton onClick={onClose}>Cancel</SketchButton>

          <SketchButton
            onClick={() => {
              onConfirm(mode === "one" ? 1 : groupSize);
              onNavigate("home");
            }}
          >
            Confirm
          </SketchButton>
        </div>
      </div>
    </div>
  );
}

// ── Match card ─────────────────────────────────────────────────────────────
function MatchCard({ match, onStrike, struck }) {
  const [hovered, setHovered] = useState(false);
  const { color, light } = getColorPair(match.color);
  const rotation = ((match.id * 7) % 30 - 15) / 10; // deterministic tilt from id

  // Format availability: if it's an ISO string, show relative time
  const availLabel = (() => {
    try {
      const d = new Date(match.availability);
      if (isNaN(d)) return match.availability; // fallback for old string values
      const diffH = Math.round((d - new Date()) / 36e5);
      if (diffH < 0)    return "free now!";
      if (diffH < 1)    return "free in under an hour";
      if (diffH < 24)   return `free in ~${diffH}h`;
      const days = Math.round(diffH / 24);
      return `free in ~${days}d`;
    } catch { return match.availability; }
  })();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", padding: "22px 20px 18px",
        transform: `rotate(${hovered ? rotation * 0.3 : rotation}deg) translateY(${hovered ? -4 : 0}px)`,
        transition: "transform 0.3s ease", cursor: "pointer",
        marginBottom: 8, animation: "cardReveal 0.5s ease both",
        "--card-rot": `${rotation}deg`,
      }}
    >
      {/* Watercolor wash */}
      <div style={{
        position: "absolute", inset: "6px 7px 7px 6px",
        borderRadius: "12px 14px 13px 11px",
        background: `
          radial-gradient(ellipse at 25% 25%, ${light} 0%, ${color}55 45%, transparent 72%),
          radial-gradient(ellipse at 80% 75%, ${light}BB 0%, ${color}33 40%, transparent 65%)
        `,
        filter: "url(#watercolor) blur(2px)", zIndex: 0, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: "-10px -12px -12px -10px",
        borderRadius: "20px 24px 22px 18px",
        background: "rgba(255,255,255,0.75)",
        filter: "blur(6px)", zIndex: 1, pointerEvents: "none",
      }} />
      {/* Sketch outline */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 2 }}>
        <rect x="3" y="3" width="calc(100% - 6px)" height="calc(100% - 6px)"
          rx="7" fill="none"
          stroke={struck ? color : "#5C4F8A"} strokeWidth={struck ? "3" : "2.5"}
          strokeLinecap="round" strokeLinejoin="round" style={{ filter: "url(#sketch)" }}
        />
      </svg>

      <div style={{ position: "relative", zIndex: 3 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Avatar */}
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: `radial-gradient(ellipse at 35% 35%, ${light} 0%, ${color}88 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, filter: "url(#roughBorder)", flexShrink: 0,
            }}>
              {match.avatar || "⚡"}
            </div>
            <div>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: 22, fontWeight: 700, color: palette.inkBrown, lineHeight: 1.1 }}>
                {match.name}
              </div>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: 13, color: palette.softInk, opacity: 0.6, display: "flex", alignItems: "center" }}>
                <PulseRing color={palette.waterGreen} />
                {availLabel} · {match.distanceLabel} away
              </div>
            </div>
          </div>

          {/* Strike button */}
          <button
            onClick={e => { e.stopPropagation(); onStrike(match.id); }}
            style={{
              position: "relative", padding: "8px 14px",
              background: struck
                ? `radial-gradient(ellipse at 35% 35%, ${light} 0%, ${color}88 100%)`
                : "transparent",
              border: "none", cursor: "pointer",
              fontFamily: "'Caveat', cursive", fontSize: 18, fontWeight: 700,
              color: struck ? "#3a2f5e" : palette.softInk,
              transition: "all 0.2s ease", borderRadius: 2, outline: "none",
              transform: struck ? "scale(1.08) rotate(-1deg)" : "scale(1)",
            }}
          >
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
              <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)"
                rx="8" fill="none"
                stroke={struck ? color : "rgba(123,111,160,0.45)"} strokeWidth={struck ? "2.5" : "1.8"}
                style={{ filter: "url(#sketch)" }}
              />
            </svg>
            {struck ? "⚡ struck!" : "⚡ strike"}
          </button>
        </div>

        {/* Tags — shared ones highlighted */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(match.tags || []).map(tag => {
            const isShared = (match.sharedTags || []).includes(tag);
            return (
              <span key={tag} style={{
                fontFamily: "'Caveat', cursive", fontSize: 13,
                padding: "3px 10px",
                background: isShared ? `${color}55` : `${color}22`,
                color: isShared ? "#3a2f5e" : "#5C4F8A",
                borderRadius: 20,
                border: `1.5px solid ${isShared ? color : color + "55"}`,
                filter: "url(#sketch)",
                fontWeight: isShared ? 700 : 400,
              }}>{tag}</span>
            );
          })}
        </div>

        {/* Shared interests callout */}
        {match.sharedTags?.length > 0 && (
          <div style={{
            fontFamily: "'Caveat', cursive", fontSize: 12,
            color: palette.waterGreen, marginTop: 8, fontStyle: "italic",
          }}>
            ✦ {match.sharedTags.length} interest{match.sharedTags.length > 1 ? "s" : ""} in common
          </div>
        )}
      </div>
    </div>
  );
}

// ── Strike confirmation modal ─────────────────────────────────────────────
function StruckModal({ match, onClose }) {
  const { color, light } = getColorPair(match.color);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(255,255,255,0.7)", backdropFilter: "blur(4px)",
      padding: "0 24px",
    }}>
      <div style={{ width: "100%", maxWidth: 380, animation: "popIn 0.4s ease" }}>
        <WatercolorCard color={color} lightColor={light}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>⚡</div>
            <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: 30, fontWeight: 700, color: palette.inkBrown, margin: "0 0 8px" }}>
              You struck {match.name}!
            </h2>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: palette.softInk, opacity: 0.7, margin: "0 0 20px", fontStyle: "italic", lineHeight: 1.5 }}>
              {match.name} will get a notification. If they strike back, you&apos;ll both get each other&apos;s contact info. ✦
            </p>
            <SketchButton color={color} lightColor={light} onClick={onClose} wide>
              Keep browsing →
            </SketchButton>
          </div>
        </WatercolorCard>
      </div>
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{ fontSize: 36, marginBottom: 12, animation: "sporeFloat 1.5s ease-in-out infinite" }}>⚡</div>
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 18, color: palette.inkBrown, fontStyle: "italic", opacity: 0.6 }}>
        finding kindred spirits…
      </div>
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
function EmptyState({ onNavigate }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🌿</div>
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 20, color: palette.inkBrown, fontStyle: "italic", opacity: 0.6 }}>
        no one nearby right now...
      </div>
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: palette.softInk, opacity: 0.4, marginTop: 6, marginBottom: 20 }}>
        try a wider radius or a different time
      </div>
      <SketchButton
        color={palette.waterGold} lightColor={palette.waterGoldLight}
        onClick={() => onNavigate("info")}
        wide={false}
      >
        ← change my time
      </SketchButton>
    </div>
  );
}

// ── Error state ────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontFamily: "'Caveat', cursive", fontSize: 16, color: palette.waterRose, fontStyle: "italic", marginBottom: 16 }}>
        {message}
      </div>
      <SketchButton color={palette.waterGreen} lightColor={palette.waterGreenLight} onClick={onRetry}>
        try again
      </SketchButton>
    </div>
  );
}

// ── Main ConnectPage ───────────────────────────────────────────────────────
export default function ConnectPage({ onNavigate, userInfo = {} }) {
  const { id: userId, name = "you", tags = [], dateTime, lat, lng } = userInfo;

  const [matches,     setMatches]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [struckIds,   setStruckIds]   = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [groupModal,  setGroupModal]  = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMatches({
        lat,
        lng,
        dateTime,
        tags,
        radius: 2,
        userId,
      });
      setMatches(data);
    } catch (err) {
      setError("couldn't reach the server — is the backend running on :3001?");
    } finally {
      setLoading(false);
    }
  }, [lat, lng, dateTime, tags, userId]);

  useEffect(() => { load(); }, [load]);

  async function handleStrike(matchId) {
    if (struckIds.includes(matchId)) return;
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    // Optimistic UI update
    setStruckIds(prev => [...prev, matchId]);
    setActiveModal(match);

    try {
      await sendNudge(userId, matchId);
    } catch (err) {
      // If it's already nudged from a prior session that's fine; anything else, revert
      if (err.message !== "already_nudged") {
        setStruckIds(prev => prev.filter(id => id !== matchId));
        setActiveModal(null);
      }
    }
  }

  // Friendly label for the user's selected time
  const timeLabel = (() => {
    try {
      return new Date(dateTime).toLocaleString("en-US", {
        weekday: "short", month: "short", day: "numeric",
        hour: "numeric", minute: "2-digit",
      });
    } catch { return dateTime || "now"; }
  })();

  return (
    <PageShell blobs={BLOBS} spores={SPORES}>
      <TopBar onBack={() => onNavigate("info")} />

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: 36, fontWeight: 700, color: palette.inkBrown, margin: "0 0 6px", lineHeight: 1.15 }}>
          kindred spirits{" "}
          <span style={{ color: palette.waterGreen, fontStyle: "italic" }}>nearby</span>
        </h1>
        <div style={{ fontFamily: "'Caveat', cursive", fontSize: 15, color: palette.softInk, opacity: 0.65, fontStyle: "italic", display: "flex", alignItems: "center", gap: 6 }}>
          <PulseRing color={palette.waterGreen} />
          {loading ? "searching…" : `${matches.length} people free ${timeLabel}`}
          {tags.length > 0 && ` · into ${tags[0]}`}
        </div>
      </div>

      {/* Vibe summary badge */}
      <div style={{ position: "relative", padding: "10px 16px", marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
          <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)"
            rx="16" fill={`${palette.waterGoldLight}44`}
            stroke={`${palette.waterGold}88`} strokeWidth="1.8" style={{ filter: "url(#sketch)" }}
          />
        </svg>
        <span style={{ fontFamily: "'Caveat', cursive", fontSize: 14, color: palette.softInk, opacity: 0.7 }}>
          showing as <strong style={{ color: palette.inkBrown }}>{name}</strong>
        </span>
        {tags.slice(0, 3).map(t => (
          <span key={t} style={{
            fontFamily: "'Caveat', cursive", fontSize: 12,
            padding: "2px 8px", borderRadius: 12,
            background: `${palette.waterGold}33`,
            color: "#5C4F8A", border: `1.5px solid ${palette.waterGold}88`,
            filter: "url(#sketch)",
          }}>{t}</span>
        ))}
        <button
          onClick={load}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Caveat', cursive", fontSize: 13,
            color: palette.waterGreen, opacity: 0.7,
          }}
        >
          ↻ refresh
        </button>
      </div>

      <SectionLabel>people nearby</SectionLabel>

      {/* Body */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : matches.length === 0 ? (
        <EmptyState onNavigate={onNavigate} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {matches.map((match, i) => (
            <div key={match.id} style={{ animationDelay: `${i * 0.08}s` }}>
              <MatchCard
                match={match}
                struck={struckIds.includes(match.id) || match.nudged}
                onStrike={handleStrike}
              />
            </div>
          ))}
        </div>
      )}

      {/* Strikes sent summary */}
      {struckIds.length > 0 && (
        <div style={{
          marginTop: 24, padding: "12px 16px", position: "relative",
          fontFamily: "'Caveat', cursive", fontSize: 15,
          color: palette.inkBrown, textAlign: "center",
          animation: "fadeSlideUp 0.4s ease",
        }}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
            <rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)"
              rx="12" fill={`${palette.waterGreenLight}44`}
              stroke={`${palette.waterGreen}88`} strokeWidth="1.8" style={{ filter: "url(#sketch)" }}
            />
          </svg>
          <span style={{ position: "relative", zIndex: 1 }}>
            ⚡ {struckIds.length} strike{struckIds.length > 1 ? "s" : ""} sent · waiting for sparks ✦
          </span>
        </div>
      )}

      <div style={{
                marginTop: 24, padding: "12px 16px", position: "relative",
                fontFamily: "'Caveat', cursive", fontSize: 15,
                color: palette.inkBrown, textAlign: "center",
                animation: "fadeSlideUp 0.4s ease",
              }}>     
          <SketchButton style={{ color: palette.waterBlue, lightColor: palette.waterBlueLight, position: "relative", zIndex: 1 }} onClick={() => {setGroupModal(true)}} disabled={struckIds.length === 0}>
              continue
          </SketchButton>
      </div>

      {/* Group modal */}
      {groupModal && (
        <GroupModal
           onNavigate={onNavigate}
           onClose={() => setGroupModal(false)}
           onConfirm={async (groupSize) => {
            try {
              const result = await createGroup({
                userId: userId, // your logged in profile id
                name: `${name}'s Group`,
                time: dateTime,
                tags: tags,
              });

              console.log("Group created:", result);

              // optionally navigate to home
              onNavigate("home");

            } catch (err) {
              console.error(err);
            }
          }}
         />
       )}

      <Footer />

      {activeModal && (
        <StruckModal
          match={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </PageShell>
  );
}


const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modalStyle = {
  background: "white",
  padding: 30,
  borderRadius: 16,
  width: 350,
  textAlign: "center",
};

const titleStyle = {
  marginBottom: 20,
};

const optionButton = (active) => ({
  padding: "10px 16px",
  borderRadius: 10,
  border: active ? "2px solid black" : "1px solid #ccc",
  background: active ? "#f3f3f3" : "white",
  cursor: "pointer",
});