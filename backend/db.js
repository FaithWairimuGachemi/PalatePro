const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const JSON_DB_DIR = path.join(__dirname, 'json_db');
if (!fs.existsSync(JSON_DB_DIR)) fs.mkdirSync(JSON_DB_DIR);

const JSON_FILES = {
  users: path.join(JSON_DB_DIR, 'users.json'),
  orders: path.join(JSON_DB_DIR, 'orders.json'),
  foods: path.join(JSON_DB_DIR, 'foods.json')
};

const readJson = (file) => fs.existsSync(JSON_FILES[file]) ? JSON.parse(fs.readFileSync(JSON_FILES[file])) : [];
const writeJson = (file, data) => fs.writeFileSync(JSON_FILES[file], JSON.stringify(data, null, 2));

// Define the mock implementation outside to avoid circular references
const mockDb = {
    execute: async (sql, params = []) => {
      const sqlLower = sql.toLowerCase();
      console.log(`[OFFLINE MODE] Executing: ${sqlLower.substring(0, 60)}...`);

      // LOGIN CHECK
      if (/select \* from users where phone =/i.test(sqlLower)) {
        const users = readJson('users');
        const user = users.find(u => u.phone === params[0]);
        return [user ? [user] : []];
      }
      
      // REGISTRATION
      if (/insert into users/i.test(sqlLower)) {
        const users = readJson('users');
        const newUser = { id: Date.now(), name: params[0], email: params[1], phone: params[2], password_hash: params[3], is_restaurant: params[4], preferences: params[5], is_admin: 0 };
        users.push(newUser);
        writeJson('users', users);
        return [{ insertId: newUser.id }];
      }

      // ORDER PLACEMENT
      if (/insert into orders/i.test(sqlLower)) {
        const orders = readJson('orders');
        const newOrder = { id: Date.now(), user_id: params[0], total_amount: params[1], status: 'PENDING', delivery_location: params[2], delivery_phone: params[3], mpesa_code: params[4], receipt_number: params[5], created_at: new Date().toISOString() };
        orders.push(newOrder);
        writeJson('orders', orders);
        return [{ insertId: newOrder.id }];
      }

      // MY ORDERS
      if (/select \* from orders where user_id =/i.test(sqlLower)) {
        const orders = readJson('orders');
        return [orders.filter(o => o.user_id === params[0])];
      }

      // MENU ITEMS
      if (/select \* from (foods|categories)/i.test(sqlLower)) {
          return [[
            { id: 1, name: 'Nyama Choma', price: 350, description: 'Roasted goat meat', image_url: 'https://media-cdn.tripadvisor.com/media/photo-o/08/5a/46/70/maanzoni-lodge.jpg', category_id: 1 },
            { id: 2, name: 'Pilau', price: 250, description: 'Spiced rice', image_url: 'https://toasterding.com/wp-content/uploads/2024/05/image-34.png', category_id: 1 }
          ]];
      }
      return [[]];
    },
    query: async (sql, params) => mockDb.execute(sql, params),
    getConnection: async () => ({
      execute: async (...a) => mockDb.execute(...a),
      query: async (...a) => mockDb.execute(...a),
      release: () => {}
    })
};

let pool;

async function getPool() {
  if (pool) return pool;

  // 1. Try Cloud Aiven
  try {
    const cloudPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      connectTimeout: 2000 
    });
    const conn = await cloudPool.getConnection();
    conn.release();
    console.log('✅ Connected to Cloud Database.');
    pool = cloudPool;
    return pool;
  } catch (err) {
    console.warn('❌ Cloud Database unreachable:', err.message);
  }

  // 2. Try Local MySQL (Fallback)
  try {
    const localPool = mysql.createPool({
      host: '127.0.0.1', port: 3306, user: 'root', password: '', database: process.env.DB_NAME, connectTimeout: 1000
    });
    const conn = await localPool.getConnection();
    conn.release();
    console.log('✅ Connected to Local Database.');
    pool = localPool;
    return pool;
  } catch (err) {
    console.warn('❌ Local Database unreachable. Switching to JSON PERSISTENCE mode.');
  }

  pool = mockDb;
  return pool;
}

const dbProxy = {
  execute: async (...args) => (await getPool()).execute(...args),
  query: async (...args) => (await getPool()).query(...args),
  getConnection: async () => (await getPool()).getConnection()
};

module.exports = dbProxy;
