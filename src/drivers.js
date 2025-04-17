const drivers = new Map();

function assign(vehicleId, driverId) {
  drivers.set(vehicleId, driverId);
}

function driverFor(vehicleId) {
  return drivers.get(vehicleId) || null;
}

module.exports = { assign, driverFor };
