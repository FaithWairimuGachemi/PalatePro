require('dotenv').config();
const axios = require('axios');

async function run() {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
  try {
    const tokenRes = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });
    console.log("Token:", tokenRes.data.access_token);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
run();
