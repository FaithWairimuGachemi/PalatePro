require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Create a valid token for user ID 1
const token = jwt.sign({ id: 1, is_admin: 1 }, process.env.JWT_SECRET, { expiresIn: '1d' });

async function run() {
  try {
    const res = await axios.post('http://localhost:5000/api/orders', {
      orderItems: [{ id: 1, qty: 1, price: 350 }],
      totalAmount: 400,
      deliveryLocation: "Test",
      deliveryPhone: "0700000000",
      mpesaNumber: "0700000000"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
run();
