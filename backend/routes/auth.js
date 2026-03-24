const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Generate JWT
const generateToken = (id, is_admin, is_restaurant) => {
  return jwt.sign({ id, is_admin, is_restaurant }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, phone, password, is_restaurant } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? OR phone = ?', [email, phone]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }
    
    // Quick validation for Kenyan phone number
    if (phone && !/^\+254\d{9}$/.test(phone)) {
      return res.status(400).json({ message: 'Phone number must be a valid Kenyan mobile number starting with +254 followed by 9 digits.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.execute(
      'INSERT INTO users (name, email, phone, password_hash, is_restaurant) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, password_hash, is_restaurant ? 1 : 0]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      phone,
      is_admin: 0,
      is_restaurant: is_restaurant ? 1 : 0,
      token: generateToken(result.insertId, 0, is_restaurant ? 1 : 0),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE phone = ?', [phone]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (isMatch) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_admin: user.is_admin,
        is_restaurant: user.is_restaurant,
        token: generateToken(user.id, user.is_admin, user.is_restaurant),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
});

module.exports = router;
