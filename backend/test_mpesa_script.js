require('dotenv').config();
const { initiateSTKPush } = require('./utils/mpesa');

initiateSTKPush('254708374149', 1, 9999).then(console.log).catch(err => console.error(err.message));
