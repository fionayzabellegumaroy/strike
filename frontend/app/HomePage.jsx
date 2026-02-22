// ── LandingPage.jsx ───────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import {
  palette, PageShell, WatercolorBlob, SketchButton,
  SketchInput, WatercolorCard, Footer, SectionLabel,
} from "./Shared.jsx";
import { getGroups, getProfile } from "./api.js";
import { useContext } from "react";
import { UserContext } from "../components/UserContext";
const logo = require("../assets/images/logoName.png");

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
        src={logo.uri}
        alt="Strike"
        style={{ width: 100, height: 100 }}
      /> 
      
    </div>
  
  );
}

export default function HomePage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("active"); // "active" or "public"
  const [groups, setGroups] = useState([]);
  const { userId } = useContext(UserContext);
  const [ showGroupModal, setShowGroupModal ] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [memberProfiles, setMemberProfiles] = useState([]);

  useEffect(() => {
    if (!userId) return; // wait until userId exists

    async function loadGroups() {
      try {
        const data = await getGroups({
          userId,
          type: activeTab,
        });
        setGroups(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadGroups();
  }, [activeTab, userId]);

  useEffect(() => {
    async function loadMembers() {
      if (!selectedGroup || !selectedGroup.member_ids) return;
      try {
        const profiles = await Promise.all(
          selectedGroup.member_ids.map(id => getProfile(id))
        );

        setMemberProfiles(profiles);
      } catch (err) {
        console.error("Failed to load member profiles:", err);
      }
    }

    if (showGroupModal) {
      loadMembers();
    }
  }, [showGroupModal, selectedGroup]);

  return (
    <PageShell blobs={BLOBS} spores={SPORES}>

      <Wordmark />

      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{
          fontFamily: "'Yusei Magic', sans-serif", fontSize: 46, fontWeight: 700,
          color: palette.inkBrown, margin: "0 0 12px", lineHeight: 1.12, letterSpacing: "-0.01em",
        }}>
          Home
        </h1>
        <p style={{
          fontFamily: "'Caveat', cursive", fontSize: 17, color: palette.softInk,
          opacity: 0.7, margin: 0, lineHeight: 1.5, fontStyle: "italic",
        }}>
          Find your active groups, and public groups to join.
        </p>
      </div>

      <div style={{display: "flex",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 40,
        marginTop: 14}}>
        <SketchButton
          onClick={() => setActiveTab("active")}
          color={activeTab === "active" ? palette.waterGreen : palette.softInk}
          lightColor={activeTab === "active" ? palette.waterGreenLight : "#E8E8E8"}
          active={activeTab === "active"}
        >
          Active Groups
        </SketchButton>
        <SketchButton
          onClick={() => setActiveTab("public")}
          color={activeTab === "public" ? palette.waterGreen : palette.softInk}
          lightColor={activeTab === "public" ? palette.waterGreenLight : "#E8E8E8"}
          active={activeTab === "public"}
        >
          Public Groups
        </SketchButton>
      </div>
      <WatercolorCard
        color={palette.waterGreen}
        lightColor={palette.waterGreenLight}
        style={{
          marginTop: 40,
          minHeight: 200,
          padding: 20,
        }}
      >
        {groups.length === 0 ? (
          <p style={{
            fontFamily: "'Yusei Magic', sans-serif",
            fontSize: 18,
            color: palette.inkBrown,
            opacity: 0.6,
            fontStyle: "italic",
          }}>
            No groups yet.
          </p>
        ) : (
          groups.map(group => (
            <div key={group.id} style={{ marginBottom: 16, fontFamily: "'Yusei Magic', sans-serif", color: "#33316e" }} onClick={() => {setShowGroupModal(true); setSelectedGroup(group);}}>
              <h3 style={{ margin: 0 }}>{group.name}</h3>
              <div style={{ fontSize: 14, color: palette.softInk, opacity: 0.8, fontFamily: "'Yusei Magic', sans-serif" }}>
                {group.tags.join(", ")}
              </div>
              <div style={{ fontSize: 14, opacity: 0.6, fontFamily: "'Inconsolata', monospace" }}>
                {group.member_ids.length} members
              </div>
              <div style={{ fontSize: 14 }}>
                {new Date(group.time).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </WatercolorCard>

      {showGroupModal && (
        <div
          lightColor={palette.waterGreenLight}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            fontFamily: "'Yusei Magic', sans-serif",
            color: "#33316e",
          }}
        >
          <WatercolorCard
            color={palette.waterBlue}
            lightColor={palette.waterBlueLight}
            style={{
              width: "90%",
              maxWidth: 420,
              padding: 24,
              position: "relative",
            }}
          >
            {/* Back Button */}
            <SketchButton
              color={palette.waterGold}
              lightColor={palette.waterGoldLight}
              onClick={() => {
                setShowGroupModal(false);
                setMemberProfiles([]);
              }}
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "none",
                border: "none",
                fontSize: 16,
                cursor: "pointer",
                fontFamily: "'Caveat', cursive",
              }}
            >
              ← Back
            </SketchButton>

            <h2 style={{ textAlign: "center", marginTop: 10 }}>
              {selectedGroup?.name}
            </h2>

            <div style={{ marginTop: 20 }}>
              {memberProfiles.map(member => (
                <p key={member.id}>{member.name}</p>
              ))}
            </div>
          </WatercolorCard>
        </div>
      )}

      <div style={{marginTop: 50, display: "flex", justifyContent: "center"}}>
        <SketchButton
          color={palette.waterGold}
          lightColor={palette.waterGold}
          onClick={() => onNavigate("connect")}
          wide
        >
          ⚡ I am down to hang
        </SketchButton>
      </div>
     
      <Footer />
    </PageShell>
  );
}