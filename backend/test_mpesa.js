require('dotenv').config();
const { initiateSTKPush } = require('./utils/mpesa');
initiateSTKPush('254708374149', 1, 999).then(console.log).catch(console.error);
