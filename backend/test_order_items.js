const db = require('./db');
async function run() {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [res1] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, delivery_location, delivery_phone, mpesa_number) VALUES (?, ?, ?, ?, ?)',
      [1, 100, 'Test Location', '0700000000', '0700000000']
    );
    const orderId = res1.insertId;

    const item = { id: 1, qty: 1, price: 350 };
    await connection.execute(
      'INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, item.id, item.qty, item.price]
    );

    console.log("Success!");
    await connection.rollback();
  } catch(e) {
    console.error("DB Error:", e.stack);
  } finally {
    connection.release();
    process.exit(0);
  }
}
run();
