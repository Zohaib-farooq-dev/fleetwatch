const test = require("node:test");
const assert = require("node:assert");
const { ingest, positions } = require("../src/ingest");

test("stores the last position per vehicle", () => {
  ingest({ vehicleId: "V1", lat: 31.5, lng: 74.3, at: "2025-04-14T09:00:00Z" });
  assert.equal(positions.get("V1").lat, 31.5);
});
