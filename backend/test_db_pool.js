require('dotenv').config();
const db = require('./db');

async function run() {
  console.log("Starting query...");
  try {
    const res = await db.query('SELECT 1 + 1 AS solution');
    console.log("Result:", res[0]);
  } catch(e) {
    console.error("Error:", e);
  }
  process.exit();
}
run();
