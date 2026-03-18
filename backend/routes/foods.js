const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/authMiddleware');

// @route GET /api/foods
// @desc Get all foods
router.get('/', async (req, res) => {
  try {
    const [foods] = await db.query(`
      SELECT foods.*, categories.name as category_name 
      FROM foods 
      LEFT JOIN categories ON foods.category_id = categories.id
    `);
    res.json(foods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/foods/:id
// @desc Get single food by ID
router.get('/:id', async (req, res) => {
  try {
    const [food] = await db.query('SELECT * FROM foods WHERE id = ?', [req.params.id]);
    if (food.length === 0) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/foods
// @desc Create a food item (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const { name, description, price, image_url, category_id } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO foods (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, image_url, category_id]
    );
    res.status(201).json({ id: result.insertId, name, price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/foods/categories/all
// @desc Get all categories
router.get('/categories/all', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
