require('dotenv').config();
const axios = require('axios');

async function test() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  console.log("Basic Auth Header:", auth);
  
  try {
    const tokenRes = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });
    console.log("Token response:", tokenRes.data);
  } catch(e) {
    console.log("OAuth Error:", e.response ? e.response.data : e.message);
  }
}

test();
