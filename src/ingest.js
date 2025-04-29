const positions = new Map();
const stats = { stored: 0, stale: 0 };

function ingest(ping) {
  const current = positions.get(ping.vehicleId);
  if (current && current.at >= ping.at) {
    stats.stale += 1;  // offline buffers replay old pings on reconnect; never move a van backwards
    return { stored: false, reason: "stale" };
  }
  positions.set(ping.vehicleId, { lat: ping.lat, lng: ping.lng, at: ping.at });
  stats.stored += 1;
  return { stored: true };
}

module.exports = { ingest, positions, stats };
