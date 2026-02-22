// ── App.jsx — top-level router ────────────────────────────────────────────
import { useState } from "react";
import LandingPage from "./LandingPage.jsx";
import InfoPage    from "./InfoPage.jsx";
import ConnectPage from "./ConnectPage.jsx";
import Register    from "./Register.jsx";
import HomePage    from "./HomePage.jsx";
import { UserProvider } from "../components/UserContext.jsx";

export default function App() {
  const [page, setPage]         = useState("landing");
  const [pageData, setPageData] = useState({});
  const [userInfo, setUserInfo] = useState({
    // Set after registration via POST /profile:
    id:       null,   // DB profile id — needed for nudging + exclusion
    name:     "",
    tags:     [],
    dateTime: null,   // Date object from StepTime
    lat:      null,
    lng:      null,
  });

  const navigate = (dest, data = {}) => {
    // Merge any user-info fields that come back from registration steps
    if (data.name || data.tags || data.dateTime || data.id || data.lat) {
      setUserInfo(prev => ({ ...prev, ...data }));
    }
    setPageData(data);
    setPage(dest);
  };

  if (page === "landing") return <LandingPage onNavigate={navigate} />;
  if (page === "verify")  return <InfoPage    onNavigate={navigate} />;
  if (page === "info") {
    return <InfoPage
      onNavigate={navigate}
      initialStep={pageData?.initialStep ?? 0}
      initialName={pageData?.initialName ?? ""}
    />;
  }
  if (page === "connect")  return <ConnectPage onNavigate={navigate} userInfo={userInfo} />;
  if (page === "register") return <Register    onNavigate={navigate} />;
  if (page === "home") return <HomePage    onNavigate={navigate} />;

  return <LandingPage onNavigate={navigate} />;
}