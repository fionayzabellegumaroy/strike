// backend/server.js
const express  = require("express");
const Database = require("better-sqlite3");
const cors     = require("cors");

const app = express();
const db  = new Database("strike.db");

app.use(cors());
app.use(express.json());

// ── Schema ────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL,
    avatar       TEXT,
    lat          REAL,
    lng          REAL,
    availability TEXT,   -- ISO 8601 datetime string
    tags         TEXT,   -- JSON array
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

// ── Haversine distance (miles) ─────────────────────────────────────────────
function distanceMiles(lat1, lng1, lat2, lng2) {
  const R    = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Normalize tag strings for comparison (strip whitespace, lowercase)
const normalize = t => t.trim().toLowerCase();

// ── GET / ─────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Strike API running" });
});

// ── GET /test ──────────────────────────────────────────────────────────────
app.get("/test", (req, res) => {
  res.json({ success: true });
});

// ── POST /profile ──────────────────────────────────────────────────────────
app.post("/profile", (req, res) => {
  const { name, avatar, lat, lng, availability, tags, color, light } = req.body;

  if (!name || lat == null || lng == null || !availability || !Array.isArray(tags)) {
    return res.status(400).json({
      error: "Missing required fields: name, lat, lng, availability (ISO string), tags (array)",
    });
  }

  const result = db.prepare(`
    INSERT INTO profiles (name, avatar, lat, lng, availability, tags, color, light, is_user)
    VALUES (@name, @avatar, @lat, @lng, @availability, @tags, @color, @light, 1)
  `).run({
    name,
    avatar:       avatar || "⚡",
    lat:          parseFloat(lat),
    lng:          parseFloat(lng),
    availability,               // stored as ISO string
    tags:         JSON.stringify(tags),
    color:        color || "#C798C1",
    light:        light || "#FBDBF3",
  });

  res.json({ id: result.lastInsertRowid });
});

// ── GET /matches ───────────────────────────────────────────────────────────
// Query params:
//   lat, lng      – user's coordinates (required)
//   dateTime      – ISO string of when user is free
//   tags          – comma-separated tag labels (must match seed tags exactly)
//   radius        – miles (default 2)
//   user_id       – your own id (excluded from results)
//
// Availability matching strategy:
//   • Seeded profiles have string values like "tonight" / "this weekend" —
//     they always pass the time filter (they're demo data)
//   • Real user profiles store an ISO datetime; we match those within ±2 hours
app.get("/matches", (req, res) => {
  const { lat, lng, dateTime, tags, radius = 2, user_id } = req.query;

  if (!lat || !lng) return res.status(400).json({ error: "lat and lng are required" });

  const userLat   = parseFloat(lat);
  const userLng   = parseFloat(lng);
  const userTags  = tags ? tags.split(",").map(normalize) : [];
  const userId    = user_id ? parseInt(user_id) : -1;
  const userTime  = dateTime ? new Date(dateTime) : null;
  const TWO_HOURS = 2 * 60 * 60 * 1000; // ms

  // IDs the current user already nudged (so we can mark them as struck)
  const nudgedIds = userId > 0
    ? db.prepare("SELECT to_id FROM nudges WHERE from_id = ?").all(userId).map(r => r.to_id)
    : [];

  // Fetch all profiles except current user.
  // Real user profiles expire after 4 hours; seeded profiles are always included.
  const profiles = db.prepare(`
    SELECT * FROM profiles
    WHERE id != ?
    AND (is_user = 0 OR created_at >= strftime('%s','now') - 14400)
  `).all(userId);

  const results = profiles
    .map(p => {
      const dist        = distanceMiles(userLat, userLng, p.lat, p.lng);
      const profileTags = JSON.parse(p.tags || "[]");
      const normProfile = profileTags.map(normalize);
      const sharedTags  = userTags.length
        ? profileTags.filter((_, i) => userTags.includes(normProfile[i]))
        : [];

      return {
        ...p,
        tags:       profileTags,
        distance:   dist,
        sharedTags,
        nudged:     nudgedIds.includes(p.id),
      };
    })
    .filter(p => p.distance <= parseFloat(radius))
    .filter(p => {
      if (!userTime) return true; // no time filter → show all

      // Seeded profiles: availability is a plain string ("tonight", "whenever", etc.)
      // Just always show them — they're demo data.
      if (p.is_user === 0) return true;

      // Real users: availability is an ISO string. Match within ±2 hours.
      try {
        const profileTime = new Date(p.availability);
        if (isNaN(profileTime.getTime())) return true; // unparseable → include
        return Math.abs(profileTime - userTime) <= TWO_HOURS;
      } catch {
        return true;
      }
    })
    .sort((a, b) =>
      b.sharedTags.length - a.sharedTags.length || a.distance - b.distance
    )
    .map(p => ({
      ...p,
      distanceLabel: p.distance < 0.1 ? "nearby" : `${p.distance.toFixed(1)} mi`,
    }));

  res.json(results);
});

// ── POST /nudge ────────────────────────────────────────────────────────────
app.post("/nudge", (req, res) => {
  const { from_id, to_id } = req.body;
  if (!from_id || !to_id) return res.status(400).json({ error: "from_id and to_id required" });

  try {
    db.prepare("INSERT INTO nudges (from_id, to_id) VALUES (?, ?)").run(from_id, to_id);
    res.json({ success: true });
  } catch {
    res.status(409).json({ error: "Already nudged this person" });
  }
});

// ── GET /profile/:id ───────────────────────────────────────────────────────
app.get("/profile/:id", (req, res) => {
  const p = db.prepare("SELECT * FROM profiles WHERE id = ?").get(req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json({ ...p, tags: JSON.parse(p.tags || "[]") });
});

// ── DELETE /profile/:id ────────────────────────────────────────────────────
app.delete("/profile/:id", (req, res) => {
  db.prepare("DELETE FROM profiles WHERE id = ? AND is_user = 1").run(req.params.id);
  res.json({ success: true });
});

app.listen(3001, () => console.log("⚡ Strike API on :3001"));