const express = require("express");
const { ingest } = require("./ingest");

const app = express();
app.use(express.json());
app.post("/pings", (req, res) => res.json(ingest(req.body)));
app.get("/health", (req, res) => res.json({ ok: true }));
app.listen(process.env.PORT || 3000);
