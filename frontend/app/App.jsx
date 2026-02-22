// ── App.jsx — top-level router ────────────────────────────────────────────
import { useState } from "react";
import LandingPage  from "./LandingPage.jsx";
import InfoPage     from "./InfoPage.jsx";
import ConnectPage  from "./ConnectPage.jsx";

// Simple in-memory router — swap for React Router if you prefer
export default function App() {
  const [page, setPage]         = useState("landing"); // "landing" | "verify" | "info" | "connect"
  const [userInfo, setUserInfo] = useState({});

  const navigate = (dest, data = {}) => {
    if (data.name || data.tags || data.time) setUserInfo(prev => ({ ...prev, ...data }));
    setPage(dest);
  };

  if (page === "landing") return <LandingPage onNavigate={navigate} />;
  if (page === "verify")  return <InfoPage    onNavigate={navigate} />;  // verify → info flow
  if (page === "info")    return <InfoPage    onNavigate={navigate} />;
  if (page === "connect") return <ConnectPage onNavigate={navigate} userInfo={userInfo} />;

  return <LandingPage onNavigate={navigate} />;
}