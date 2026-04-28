const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect } = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// @route POST /api/assistant
// @desc Chat with the PalatePro Assistant
router.post('/', protect, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: 'Message is required' });

  // Dynamically initialize to ensure process.env.GEMINI_API_KEY is available
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ 
      message: 'Assistant is not available. Please ensure the GEMINI_API_KEY is saved in the .env file and the server is restarted.' 
    });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const userId = req.user.id;

    // 1. Fetch user's preferences
    const [userRows] = await db.execute('SELECT name, preferences FROM users WHERE id = ?', [userId]);
    const userName = userRows[0]?.name || 'User';
    const preferences = userRows[0]?.preferences || 'None specified';

    // 2. Fetch user's past order patterns
    const [orderItemsRows] = await db.execute(`
      SELECT f.name, COUNT(oi.food_id) as freq 
      FROM order_items oi 
      JOIN orders o ON oi.order_id = o.id 
      JOIN foods f ON oi.food_id = f.id
      WHERE o.user_id = ?
      GROUP BY f.name 
      ORDER BY freq DESC 
      LIMIT 10
    `, [userId]);
    const pastOrders = orderItemsRows.length > 0 
      ? orderItemsRows.map(r => `${r.name} (${r.freq} times)`).join(', ') 
      : 'No past orders yet.';

    // 3. Fetch current available menu items to recommend
    const [menuRows] = await db.execute('SELECT name, price, description FROM foods WHERE is_available = TRUE');
    const menuItems = menuRows.map(f => `${f.name} (KSh ${f.price}): ${f.description}`).join(' | ');

    // 4. Construct System Prompt
    const systemInstruction = `
      You are the friendly and enthusiastic "PalatePro Assistant", a helpful AI designed to help customers of the PalatePro food delivery app decide what to eat based on Kenyan cuisine.
      The user's name is ${userName}.
      Their stated food preferences are: ${preferences}.
      Their most frequent past orders are: ${pastOrders}.
      The currently available menu is: ${menuItems}.
      
      Instructions:
      - Answer the user's message kindly.
      - If they ask for food recommendations, analyze their preferences and past orders to suggest specific items from the available menu.
      - Mention why you think they'll like it (e.g., "Since you love Burgers, I recommend..." or "You've ordered the Nyama Choma 3 times, how about...").
      - Keep responses concise, appetizing, and highly relevant to the menu we offer.
      - NEVER recommend or invent foods that are NOT on the currently available menu.
    `;

    // 5. Query Gemini Model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
    
    const result = await model.generateContent(message);
    const textResponse = result.response.text();

    res.json({ reply: textResponse });

  } catch (error) {
    console.error('Assistant Error:', error);
    res.status(500).json({ message: 'Error processing your request.' });
  }
});

module.exports = router;
