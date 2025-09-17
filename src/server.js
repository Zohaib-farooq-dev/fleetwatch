const express = require("express");
const { ingest, stats } = require("./ingest");
const { onPing } = require("./alerts");
const { check } = require("./geofence");
const { pushAlert } = require("./notify");

const app = express();
app.use(express.json({ limit: "1mb" }));

function handle(ping) {
  const result = ingest(ping);
  if (!result.stored) return result;
  const alert = onPing(ping);
  if (alert) pushAlert(alert).catch(() => {});
  return { ...result, alert, fences: check(ping.vehicleId, ping) };
}

app.post("/pings", (req, res) => {
  const pings = Array.isArray(req.body) ? req.body : [req.body];  // firmware 2.3 batches up to 50; 2.2 still sends one
  const results = pings.map(handle);
  res.json(Array.isArray(req.body) ? results : results[0]);
});
app.get("/stats", (req, res) => res.json(stats));
app.get("/health", (req, res) => res.json({ ok: true }));
app.listen(process.env.PORT || 3000);
