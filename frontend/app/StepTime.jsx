// ── StepTime.jsx — Step 2: When are you free? ─────────────────────────────
import { useState } from "react";
import { palette, WatercolorCard, SketchButton } from "./Shared";

// Calendar
function Calendar({ selectedDate, onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const today = new Date();

  const daysArray = [];

  // Empty cells
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(<div key={"empty-" + i} className="cal-day empty"></div>);
  }

  // Actual days
  for (let d = 1; d <= totalDays; d++) {
    const thisDate = new Date(year, month, d);

    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    const isSelected =
      selectedDate &&
      thisDate.toDateString() === selectedDate.toDateString();

    daysArray.push(
      <div
        key={d}
        className={`cal-day ${isToday ? "today" : ""} ${isSelected ? "selected-day" : ""}`}
        onClick={() => onSelectDate(thisDate)}
      >
        {d}
      </div>
    );
  }

  return (
    <div>
         <style>{`
        .cal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-family: 'Yusei Magic', sans-serif;
          font-size: 16px;
          color: #33316e;
        }

        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
          font-family: 'Yusei Magic', sans-serif;
          font-size: 16px;
          color: #33316e;
        }

        .cal-day {
          aspect-ratio: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          border-radius: 8px;
          font-family: 'Yusei Magic', sans-serif;
          font-size: 16px;
          color: #7B6FA0;
        }

        .cal-day:hover {
          background: rgba(163, 201, 136, 0.2);
        }

        .today {
          border: 1px solid black;
        }

        .selected-day {
          background: #7B6FA0 ;
          color: white;
        }
      `}</style>

      <div className="cal-header">
        <button
          className="cal-nav"
          onClick={() =>
            setCurrentDate(new Date(year, month - 1, 1))
          }
        >
          ‹
        </button>

        <span>{monthNames[month]} {year}</span>

        <button
          className="cal-nav"
          onClick={() =>
            setCurrentDate(new Date(year, month + 1, 1))
          }
        >
          ›
        </button>
      </div>

      <div className="cal-grid">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(day => (
          <div key={day} className="cal-day-label">{day}</div>
        ))}
        {daysArray}
      </div>
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
        fontFamily: "'Yusei Magic', sans-serif", fontSize: 15, fontWeight: 600,
        color: selected ? "#3a2f5e" : "rgba(91,78,138,0.5)",
        background: selected
          ? `radial-gradient(ellipse at 35% 35%, ${palette.waterGreenLight} 0%, ${palette.waterBlue}55 100%)`
          : hovered ? `${palette.waterGreenLight}44` : "transparent",
        transform: selected ? "rotate(-0.3deg) scale(1.04)" : "scale(1)",
        transition: "all 0.2s ease", borderRadius: 16,
      }}
    >
      <svg style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        overflow: "visible", pointerEvents: "none",
      }}>
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

// ── Main StepTime component ───────────────────────────────────────────────
export default function StepTime({ name, tags, onDone }) {
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const handleSubmit = () => {
  if (!selectedDate || !selectedTime) return;

  const combined = new Date(selectedDate);
  const [hours, minutes] = selectedTime.split(":");

  combined.setHours(hours);
  combined.setMinutes(minutes);
  combined.setSeconds(0);

  onDone({
    name,
    tags,
    dateTime: combined
    });
  };

  const isPastSelection = () => {
  if (!selectedDate || !selectedTime) return true;

  const [hours, minutes] = selectedTime.split(":").map(Number);

  const selectedDateTime = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    hours,
    minutes,
    0,
    0
  );

  const now = new Date();

  console.log("Selected:", selectedDateTime);
  console.log("Now:", now);

  return selectedDateTime.getTime() <= now.getTime();
};

  return (
    <WatercolorCard color={palette.waterGreen} lightColor={palette.waterGreenLight}>
      <h2 style={{
        fontFamily: "'Yusei Magic', sans-serif", fontSize: 32, fontWeight: 700,
        color: palette.ink, margin: "0 0 6px", lineHeight: 1.2,
      }}>
        When are you{" "}
        <span style={{ color: palette.inkBrown, fontStyle: "italic" }}>free?</span>
      </h2>
      <p style={{
        fontFamily: "'Inconsolata', monospace", fontSize: 15, color: palette.softInk,
        opacity: 0.65, margin: "0 0 20px", 
      }}>
        We&apos;ll only show you people who are free at the same time.
      </p>
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
          marginTop: 15,
          fontFamily: "'Yusei Magic', sans-serif",
        }}
      >
        <span style={{ fontSize: 16, color: "#33316e"  }}>Time:</span>

        <input
          type="time"
          value={selectedTime || ""}
          onChange={(e) => setSelectedTime(e.target.value)}
          style={{
            padding: "6px 10px",
            fontSize: 15,
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.2)",
            background: "white",
            fontFamily: "'Yusei Magic', sans-serif",
            cursor: "pointer",
          }}
        />
      </div>
      <SketchButton
        color={palette.waterGreen}
        lightColor={palette.waterGreenLight}
        onClick={handleSubmit}
        wide
        disabled={!selectedTime || !selectedDate || isPastSelection()}
      >
        Find my people →
      </SketchButton>
    </WatercolorCard>
  );
}