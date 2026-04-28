const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

async function getPool() {
  if (pool) return pool;

  // 1. Try Cloud Aiven
  try {
    console.log('Attempting Cloud Database connection...');
    const cloudPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 5000 
    });
    // Test connection
    const conn = await cloudPool.getConnection();
    conn.release();
    console.log('✅ Connected to Cloud Database.');
    pool = cloudPool;
    return pool;
  } catch (err) {
    console.error('❌ Cloud Database unreachable:', err.message);
  }

  // 2. Try Local MySQL (Fallback)
  try {
    console.log('Attempting Local Database connection (localhost:3306)...');
    const localPool = mysql.createPool({
      host: '127.0.0.1',
      port: 3306,
      user: 'root', // assuming root
      password: '', // assuming no password or same as cloud?
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 2000
    });
    const conn = await localPool.getConnection();
    conn.release();
    console.log('✅ Connected to Local Database.');
    pool = localPool;
    return pool;
  } catch (err) {
    console.error('❌ Local Database unreachable:', err.message);
  }

  // 3. Mock Fallback (Safety net)
  console.warn('⚠️ SYSTEM WARNING: Running in MOCK DATABASE mode. Data will not persist.');
  return {
    execute: async () => [[]],
    query: async () => [[]],
    getConnection: async () => ({
      execute: async () => [[]],
      query: async () => [[]],
      release: () => {}
    })
  };
}

// Export a proxy that auto-initializes
const dbProxy = {
  execute: async (...args) => (await getPool()).execute(...args),
  query: async (...args) => (await getPool()).query(...args),
  getConnection: async () => (await getPool()).getConnection()
};

module.exports = dbProxy;
