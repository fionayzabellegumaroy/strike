// backend/seed.js
// ⚠️  Tag strings here MUST match ALL_TAGS in StepTags.jsx exactly.
//     The backend does a lowercase string comparison — any mismatch means
//     shared tags won't be computed and matches won't be sorted correctly.

const Database = require("better-sqlite3");
const db = new Database("strike.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    avatar       TEXT,
    lat          REAL,
    lng          REAL,
    availability TEXT,
    tags         TEXT,
    color        TEXT,
    light        TEXT,
    is_user      INTEGER DEFAULT 0,
    created_at   INTEGER DEFAULT (strftime('%s','now'))
  );
  CREATE TABLE IF NOT EXISTS nudges (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    from_id  INTEGER NOT NULL,
    to_id    INTEGER NOT NULL,
    sent_at  INTEGER DEFAULT (strftime('%s','now')),
    UNIQUE(from_id, to_id)
  );
`);

const NAMES   = ["Maya","Theo","Priya","Jordan","Sam","Alex","Riley","Zoe","Kai","Nadia","Marcus","Leila","Dev","Sofia","Eli"];
const AVATARS = ["🌸","🌊","🌿","✨","🔥","🌙","⚡","🎯","🍀","🌺","🎨","🦋","🌈","🎵","🏔️"];

// ── Must exactly match StepTags.jsx ALL_TAGS labels ───────────────────────
const ALL_TAGS = [
  "☕ coffee",
  "📚 studying",
  "🎨 art",
  "🌿 outdoors",
  "🎮 gaming",
  "🍕 food",
  "🎵 music",
  "🏃 active",
  "🎬 movies",
  "📖 reading",
  "🧘 chill",
  "🌙 night owl",
  "☀️ early bird",
  "🐾 pets",
  "✈️ travel",
  "💻 tech",
];

// Seeded profiles use a string availability so they always appear in results
// regardless of the time filter (which only applies to real user profiles).
const TIMES = ["tonight", "this afternoon", "this evening", "tomorrow", "this weekend", "whenever"];

const COLORS = [
  { color: "#C798C1", light: "#FBDBF3" }, // waterRose
  { color: "#A6C1DC", light: "#D4E6F3" }, // waterBlue
  { color: "#85A75C", light: "#A3C988" }, // waterGreen
  { color: "#F4DC81", light: "#FAF0C0" }, // waterGold
];

// NYU Washington Square Park area — adjust to your campus
const BASE_LAT = 40.7291;
const BASE_LNG = -73.9965;

function randomOffset(maxMiles) { return (Math.random() - 0.5) * 2 * maxMiles * 0.0145; }
function pickRandom(arr, n)     { return [...arr].sort(() => Math.random() - 0.5).slice(0, n); }

// Clear old seeded profiles before re-seeding
db.prepare("DELETE FROM profiles WHERE is_user = 0").run();

const insert = db.prepare(`
  INSERT INTO profiles (name, avatar, lat, lng, availability, tags, color, light, is_user)
  VALUES (@name, @avatar, @lat, @lng, @availability, @tags, @color, @light, 0)
`);

db.transaction(() => {
  NAMES.forEach((name, i) => {
    const c = COLORS[i % COLORS.length];
    insert.run({
      name,
      avatar:       AVATARS[i],
      lat:          BASE_LAT + randomOffset(2),
      lng:          BASE_LNG + randomOffset(2),
      availability: TIMES[Math.floor(Math.random() * TIMES.length)],
      tags:         JSON.stringify(pickRandom(ALL_TAGS, 4)),
      color:        c.color,
      light:        c.light,
    });
  });
})();

console.log(`✅ Seeded ${NAMES.length} profiles into strike.db`);
db.close();