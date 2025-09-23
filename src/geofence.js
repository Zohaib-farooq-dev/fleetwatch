const fences = [];
const inside = new Map();

function addFence(id, lat, lng, radiusM) {
  fences.push({ id, lat, lng, radiusM });
}

function removeFence(id) {
  const i = fences.findIndex((f) => f.id === id);
  if (i >= 0) fences.splice(i, 1);
  for (const key of [...inside.keys()]) if (key.endsWith(`:${id}`)) inside.delete(key);  // or the next ping raises a bogus exit
}

function metres(a, b) {
  const R = 6371000, toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function check(vehicleId, pos) {
  const events = [];
  for (const f of fences) {
    const key = `${vehicleId}:${f.id}`;
    const now = metres(pos, f) <= f.radiusM, was = inside.get(key) || false;
    if (now !== was) events.push({ vehicleId, fence: f.id, type: now ? "enter" : "exit" });
    inside.set(key, now);
  }
  return events;
}

module.exports = { addFence, removeFence, check, metres };
