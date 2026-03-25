const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin, restaurant } = require('../middleware/authMiddleware');

// @route GET /api/foods
// @desc Get all foods
router.get('/', async (req, res) => {
  try {
    const [foods] = await db.query(`
      SELECT foods.*, categories.name as category_name, users.name as restaurant_name 
      FROM foods 
      LEFT JOIN categories ON foods.category_id = categories.id
      LEFT JOIN users ON foods.restaurant_id = users.id
    `);
    res.json(foods);
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

// @route GET /api/foods/provider
// @desc Get all foods for a specific restaurant provider
router.get('/provider', protect, restaurant, async (req, res) => {
  try {
    const [foods] = await db.query(`
      SELECT foods.*, categories.name as category_name 
      FROM foods 
      LEFT JOIN categories ON foods.category_id = categories.id
      WHERE foods.restaurant_id = ?
    `, [req.user.id]);
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
// @desc Create a food item (Admin/Restaurant only)
router.post('/', protect, restaurant, async (req, res) => {
  const { name, description, price, image_url, category_id, is_available } = req.body;
  const avail = is_available !== undefined ? is_available : true;
  try {
    const [result] = await db.execute(
      'INSERT INTO foods (name, description, price, image_url, category_id, restaurant_id, is_available) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, image_url, category_id, req.user.id, avail]
    );
    res.status(201).json({ id: result.insertId, name, price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PUT /api/foods/:id
// @desc Edit a food item (Restaurant only)
router.put('/:id', protect, restaurant, async (req, res) => {
  const { name, description, price, image_url, category_id, is_available } = req.body;
  const foodId = req.params.id;
  try {
    // Verify ownership
    const [food] = await db.query('SELECT * FROM foods WHERE id = ?', [foodId]);
    if (food.length === 0) return res.status(404).json({ message: 'Food not found' });
    
    // Only the owning restaurant or an admin can edit
    if (food[0].restaurant_id !== req.user.id && !req.user.is_admin) {
      return res.status(403).json({ message: 'Not authorized to edit this item' });
    }

    await db.execute(
      'UPDATE foods SET name=?, description=?, price=?, image_url=?, category_id=?, is_available=? WHERE id=?',
      [name, description, price, image_url, category_id, is_available ? 1 : 0, foodId]
    );
    res.json({ message: 'Food updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
