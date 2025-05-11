const test = require("node:test");
const assert = require("node:assert");
const { addFence, check } = require("../src/geofence");

test("enter then exit", () => {
  addFence("depot", 31.52, 74.35, 200);
  assert.deepEqual(check("V9", { lat: 31.52, lng: 74.35 })[0].type, "enter");
  assert.deepEqual(check("V9", { lat: 31.6, lng: 74.5 })[0].type, "exit");
});
