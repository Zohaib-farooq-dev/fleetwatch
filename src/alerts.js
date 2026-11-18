const { metres } = require("./geofence");

const LIMIT_KMH = Number(process.env.SPEED_LIMIT_KMH || 90);  // Karachi highway fleet runs at 110, city vans at 90
const MIN_MOVE_M = 20;  // GPS jitter on a parked van looks like 300 km/h over 2 seconds
const last = new Map();
const strikes = new Map();
const alerts = [];

function onPing(ping) {
  const prev = last.get(ping.vehicleId);
  last.set(ping.vehicleId, ping);
  if (!prev) return null;
  const dist = metres(prev, ping);
  const hours = (Date.parse(ping.at) - Date.parse(prev.at)) / 3600000;
  if (hours <= 0 || dist < MIN_MOVE_M) return null;
  const kmh = dist / 1000 / hours;
  const count = kmh > LIMIT_KMH ? (strikes.get(ping.vehicleId) || 0) + 1 : 0;
  strikes.set(ping.vehicleId, count);
  if (count === 2) {
    const alert = { vehicleId: ping.vehicleId, kmh: Math.round(kmh), at: ping.at };
    alerts.push(alert);
    return alert;
  }
  return null;
}

module.exports = { onPing, alerts, LIMIT_KMH, MIN_MOVE_M };
