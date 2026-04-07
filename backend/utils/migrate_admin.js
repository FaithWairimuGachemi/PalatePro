const db = require('../db');
const bcrypt = require('bcryptjs');

async function migrate() {
  try {
    console.log('Altering orders table status ENUM to include ON_DELIVERY...');
    await db.query(`ALTER TABLE orders MODIFY COLUMN status ENUM('PENDING', 'PREPARING', 'ON_DELIVERY', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING'`);
    console.log('ENUM successfully updated!');

    console.log('Seeding 4 admins...');
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('adminpass123', salt);
    
    const admins = [
      ['Admin One', 'admin1@palatepro.com', '+254799000001', password_hash, 1, 0],
      ['Admin Two', 'admin2@palatepro.com', '+254799000002', password_hash, 1, 0],
      ['Admin Three', 'admin3@palatepro.com', '+254799000003', password_hash, 1, 0],
      ['Admin Four', 'admin4@palatepro.com', '+254799000004', password_hash, 1, 0]
    ];

    for (const admin of admins) {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [admin[1]]);
      if (rows.length === 0) {
        await db.query('INSERT INTO users (name, email, phone, password_hash, is_admin, is_restaurant) VALUES (?, ?, ?, ?, ?, ?)', admin);
        console.log(`Seeded ${admin[1]}`);
      } else {
        console.log(`Admin ${admin[1]} already exists, skipping.`);
      }
    }
    
    console.log('Migration Complete.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}
migrate();
