const { metres } = require("./geofence");

const LIMIT_KMH = 90;
const last = new Map();
const strikes = new Map();
const alerts = [];

function onPing(ping) {
  const prev = last.get(ping.vehicleId);
  last.set(ping.vehicleId, ping);
  if (!prev) return null;
  const hours = (Date.parse(ping.at) - Date.parse(prev.at)) / 3600000;
  if (hours <= 0) return null;
  const kmh = metres(prev, ping) / 1000 / hours;
  const count = kmh > LIMIT_KMH ? (strikes.get(ping.vehicleId) || 0) + 1 : 0;
  strikes.set(ping.vehicleId, count);
  if (count === 2) {
    const alert = { vehicleId: ping.vehicleId, kmh: Math.round(kmh), at: ping.at };
    alerts.push(alert);
    return alert;
  }
  return null;
}

module.exports = { onPing, alerts, LIMIT_KMH };
