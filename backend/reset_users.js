const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetUsers() {
    let connection;
    try {
        console.log('Attempting to connect to database for user reset...');
        
        // Use the primary connection details
        try {
            connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT || 3306,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                ssl: { rejectUnauthorized: false },
                connectTimeout: 5000
            });
            console.log('✅ Connected to Cloud Database.');
        } catch (err) {
            console.log('Cloud DB failed, trying local...');
            connection = await mysql.createConnection({
                host: '127.0.0.1',
                port: 3306,
                user: 'root',
                password: '',
                database: process.env.DB_NAME,
                connectTimeout: 2000
            });
            console.log('✅ Connected to Local Database.');
        }

        console.log('Clearing all users and orders...');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('TRUNCATE TABLE order_items');
        await connection.execute('TRUNCATE TABLE orders');
        await connection.execute('TRUNCATE TABLE users');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

        // Re-seed the Master Admin just in case you want to use the DB instead of rescue mode
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash('admin1pass', salt);

        console.log('Re-seeding master admin...');
        await connection.execute(
            'INSERT INTO users (name, email, phone, password_hash, is_admin) VALUES (?, ?, ?, ?, ?)',
            ['PalatePro Admin', 'admin@palatepro.com', '+254797460219', hashedPass, 1]
        );

        console.log('✨ SUCCESS: All previous accounts and orders have been deleted.');
        console.log('🚀 You can now register fresh accounts from the frontend!');

    } catch (err) {
        console.error('❌ ERROR during reset:', err.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

resetUsers();
