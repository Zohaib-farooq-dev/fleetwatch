const positions = new Map();

function ingest(ping) {
  positions.set(ping.vehicleId, { lat: ping.lat, lng: ping.lng, at: ping.at });
  return { stored: true };
}

module.exports = { ingest, positions };
