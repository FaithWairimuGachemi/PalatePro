const db = require('./db');
async function run() {
  console.log("Calling query");
  try {
    const res = await db.query('SELECT 1+1');
    console.log("Done", res);
  } catch(e) {
    console.error("Error", e);
  }
}
run();
