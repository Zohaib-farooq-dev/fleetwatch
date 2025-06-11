const test = require("node:test");
const assert = require("node:assert");
const { onPing } = require("../src/alerts");

test("jitter on a parked van does not alert", () => {
  onPing({ vehicleId: "P1", lat: 31.5000, lng: 74.3000, at: "2025-06-01T10:00:00Z" });
  assert.equal(onPing({ vehicleId: "P1", lat: 31.50005, lng: 74.30005, at: "2025-06-01T10:00:02Z" }), null);
});
