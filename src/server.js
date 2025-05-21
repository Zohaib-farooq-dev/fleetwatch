const express = require("express");
const { ingest } = require("./ingest");
const { onPing } = require("./alerts");
const { check } = require("./geofence");

const app = express();
app.use(express.json());
app.post("/pings", (req, res) => {
  const result = ingest(req.body);
  if (!result.stored) return res.status(202).json(result);
  res.json({ ...result, alert: onPing(req.body), fences: check(req.body.vehicleId, req.body) });
});
app.get("/health", (req, res) => res.json({ ok: true }));
app.listen(process.env.PORT || 3000);
