const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost',      // Capacitor Android
  'capacitor://localhost', // Capacitor iOS
  'http://10.22.3.228',
  'http://10.22.3.228:5173',
  'http://10.22.3.228:5000'
];
app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('PalatePro API is running');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/foods', require('./routes/foods'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/mpesa', require('./routes/mpesa'));
app.use('/api/assistant', require('./routes/assistant'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
