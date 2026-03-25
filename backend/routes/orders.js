const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, admin } = require('../middleware/authMiddleware');

// @route POST /api/orders
// @desc Create new order and trigger M-Pesa
router.post('/', protect, async (req, res) => {
  const { orderItems, totalAmount, deliveryLocation, deliveryPhone, mpesaNumber } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, delivery_location, delivery_phone, phone_number) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, totalAmount, deliveryLocation || 'N/A', deliveryPhone || null, mpesaNumber || null]
    );
    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, food_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.qty, item.price]
      );
    }

    await connection.commit();
    
    let mpesaResponse = null;
    if (mpesaNumber) {
      const mpesa = require('../utils/mpesa');
      mpesaResponse = await mpesa.initiateSTKPush(mpesaNumber, totalAmount, orderId);
    }

    res.status(201).json({ message: 'Order created', orderId, mpesaResponse });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

// @route GET /api/orders/myorders
// @desc Get logged in user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    // Fetch items for each order
    for (let order of orders) {
      const [items] = await db.query(
        'SELECT oi.*, f.name, f.image_url, f.is_available FROM order_items oi JOIN foods f ON oi.food_id = f.id WHERE oi.order_id = ?',
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/orders
// @desc Get all orders (Admin)
router.get('/', protect, admin, async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.name as user_name, u.email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PUT /api/orders/:id/status
// @desc Update order status (Admin)
router.put('/:id/status', protect, admin, async (req, res) => {
  const { status } = req.body;
  try {
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
