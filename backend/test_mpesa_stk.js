const axios = require('axios');
require('dotenv').config();

async function run() {
  try {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    const tokenRes = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });
    const token = tokenRes.data.access_token;
    console.log("Got token:", token);

    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    const stkRes = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: 1,
      PartyA: "254708374149",
      PartyB: shortCode,
      PhoneNumber: "254708374149",
      CallBackURL: `https://mydomain.com/api/mpesa/callback`,
      AccountReference: `PalatePro`,
      TransactionDesc: "Payment"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(stkRes.data);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
run();
