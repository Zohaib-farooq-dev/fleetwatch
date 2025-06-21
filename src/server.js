const express = require("express");
const { ingest } = require("./ingest");
const { onPing } = require("./alerts");
const { check } = require("./geofence");
const { pushAlert } = require("./notify");

const app = express();
app.use(express.json());
app.post("/pings", async (req, res) => {
  const result = ingest(req.body);
  if (!result.stored) return res.status(202).json(result);
  const alert = onPing(req.body);
  if (alert) pushAlert(alert).catch(() => {});
  res.json({ ...result, alert, fences: check(req.body.vehicleId, req.body) });
});
app.get("/health", (req, res) => res.json({ ok: true }));
app.listen(process.env.PORT || 3000);
