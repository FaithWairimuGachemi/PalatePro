const db = require('./db');
async function run() {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [res] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, delivery_location, delivery_phone, mpesa_number) VALUES (?, ?, ?, ?, ?)',
      [1, 100, 'Test Location', '0700000000', '0700000000']
    );
    console.log("Success:", res);
    await connection.rollback();
  } catch(e) {
    console.error("DB Error:", e.message);
  } finally {
    connection.release();
    process.exit(0);
  }
}
run();
