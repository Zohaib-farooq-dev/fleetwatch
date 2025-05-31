const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://fleet:fleet@localhost:5432/fleet" });

async function upsertPosition(vehicleId, pos) {
  await pool.query(
    "insert into positions (vehicle_id, lat, lng, at) values ($1,$2,$3,$4) on conflict (vehicle_id) do update set lat=$2, lng=$3, at=$4",
    [vehicleId, pos.lat, pos.lng, pos.at]
  );
}

module.exports = { pool, upsertPosition };
