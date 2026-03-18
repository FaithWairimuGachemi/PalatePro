const axios = require('axios');

exports.initiateSTKPush = async (phone, amount, orderId) => {
  console.log(`Initiating M-Pesa STK Push for Order: ${orderId}, Phone: ${phone}, Amount: KSh ${amount}`);
  
  // If no Safaricom credentials exist in env, simulate the Daraja API response perfectly
  if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
    console.log(`[MOCK DARAJA API] Emulating STK Push to ${phone}`);
    
    // Simulate Safaricom confirming the payment asynchronously after 5 seconds
    setTimeout(async () => {
       try {
         const db = require('../db');
         const receipt = 'OXY' + Math.floor(1000000 + Math.random() * 9000000);
         await db.execute("UPDATE orders SET status = 'PAID', mpesa_receipt = ? WHERE id = ?", [receipt, orderId]);
         console.log(`[MOCK DARAJA WEBHOOK] Received successful payment callback for Order ${orderId}. Marked as PAID.`);
       } catch (err) {
         console.error('Mock M-Pesa callback error:', err);
       }
    }, 5000);

    return { 
      ResponseCode: '0', 
      ResponseDescription: 'Success. Request accepted for processing', 
      CheckoutRequestID: 'ws_CO_' + Date.now() 
    };
  }
  
  /* 
   * REAL DARAJA LOGIC (Active when .env keys are populated)
   */
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    
    // 1. Get OAuth Token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const tokenRes = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });
    const token = tokenRes.data.access_token;
    
    // 2. STK Push
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
    
    const stkRes = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(amount), // M-pesa requires round numbers
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: `https://yourdomain.com/api/mpesa/callback`,
      AccountReference: `PalatePro Order ${orderId}`,
      TransactionDesc: "Payment for Food Delivery"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return stkRes.data;
  } catch (error) {
    console.error('Real M-Pesa Daraja Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to initiate M-Pesa payment');
  }
};
