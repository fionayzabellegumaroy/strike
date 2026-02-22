// api.js
// ⚠️  Change BASE_URL to your LAN IP when testing on a physical device
const BASE_URL = "http://localhost:3001";

// ── POST /profile ──────────────────────────────────────────────────────────
// Saves user to DB. Returns { id }.
// availability is stored as an ISO datetime string for precise matching.
export async function createProfile({ name, avatar, lat, lng, availability, tags, color, light }) {
  const res = await fetch(`${BASE_URL}/profile`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ name, avatar, lat, lng, availability, tags, color, light }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `POST /profile failed: ${res.status}`);
  }
  return res.json(); // { id }
}

// ── GET /matches ───────────────────────────────────────────────────────────
// lat, lng     – user coordinates (numbers)
// dateTime     – ISO string of when user is free (matches within ±2h window)
// tags         – string[] (must match seed tags exactly)
// radius       – miles (default 2)
// userId       – your own profile id (excluded from results)
//
// Returns array of profiles with: sharedTags[], distanceLabel, nudged (bool)
export async function fetchMatches({ lat, lng, dateTime, tags = [], radius = 2, userId }) {
  const params = new URLSearchParams({
    lat,
    lng,
    radius,
    ...(dateTime    && { dateTime }),
    ...(tags.length && { tags: tags.join(",") }),
    ...(userId      && { user_id: userId }),
  });
  const res = await fetch(`${BASE_URL}/matches?${params}`);
  if (!res.ok) throw new Error(`GET /matches failed: ${res.status}`);
  return res.json();
}

// ── POST /nudge ────────────────────────────────────────────────────────────
export async function sendNudge(fromId, toId) {
  const res = await fetch(`${BASE_URL}/nudge`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ from_id: fromId, to_id: toId }),
  });
  if (res.status === 409) throw new Error("already_nudged");
  if (!res.ok) throw new Error(`POST /nudge failed: ${res.status}`);
  return res.json();
}

// ── DELETE /profile/:id ────────────────────────────────────────────────────
export async function deleteProfile(id) {
  await fetch(`${BASE_URL}/profile/${id}`, { method: "DELETE" });
}