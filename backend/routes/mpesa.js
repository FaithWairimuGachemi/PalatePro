const express = require('express');
const router = express.Router();
const db = require('../db');
const { sendReceiptEmail } = require('../utils/email');

// @route POST /api/mpesa/callback
// @desc Handle M-Pesa STK Push results
router.post('/callback', async (req, res) => {
    const { Body } = req.body;
    console.log('M-Pesa Callback Received:', JSON.stringify(Body, null, 2));

    if (!Body || !Body.stkCallback) {
        return res.status(400).send('Invalid callback structure');
    }

    const { ResultCode, ResultDesc, CallbackMetadata, CheckoutRequestID } = Body.stkCallback;

    if (ResultCode === 0) {
        // Success
        const amountItem = CallbackMetadata.Item.find(i => i.Name === 'Amount');
        const mpesaReceiptItem = CallbackMetadata.Item.find(i => i.Name === 'MpesaReceiptNumber');
        const phoneItem = CallbackMetadata.Item.find(i => i.Name === 'PhoneNumber');

        const amount = amountItem ? amountItem.Value : 0;
        const mpesa_receipt = mpesaReceiptItem ? mpesaReceiptItem.Value : 'N/A';
        const phone = phoneItem ? phoneItem.Value : 'N/A';

        console.log(`Payment Success! Amount: ${amount}, Receipt: ${mpesa_receipt}, Phone: ${phone}`);

        try {
            // Find the order that matches this CheckoutRequestID?
            // Actually, we should store CheckoutRequestID in the orders table when initiating the push.
            // Let's check if we have that column. (We don't currently in schema.sql).
            
            // Fallback: Try to find the most recent PENDING order for this phone number/amount?
            // Better: I'll add the CheckoutRequestID to the orders table.
            
            // Normalize phone for comparison (last 9 digits)
            const normalizedPhoneMatch = phone.toString().slice(-9);

            const [orderRows] = await db.query(
                "SELECT id, user_id FROM orders WHERE status = 'PENDING' AND total_amount = ? AND mpesa_number LIKE ? ORDER BY created_at DESC LIMIT 1",
                [amount, `%${normalizedPhoneMatch}`]
            );

            if (orderRows.length > 0) {
                const orderId = orderRows[0].id;
                const userId = orderRows[0].user_id;
                const receipt_number = 'RCPT-' + Date.now().toString().slice(-6) + '-' + orderId;

                await db.execute(
                    "UPDATE orders SET status = 'PAID', mpesa_receipt = ?, receipt_number = ? WHERE id = ?",
                    [mpesa_receipt, receipt_number, orderId]
                );

                // Fetch user email
                const [userRows] = await db.query("SELECT email FROM users WHERE id = ?", [userId]);
                if (userRows.length > 0) {
                    const email = userRows[0].email;
                    
                    // Fetch items for receipt
                    const [items] = await db.query(
                        'SELECT f.name, oi.quantity, oi.price FROM order_items oi JOIN foods f ON oi.food_id = f.id WHERE oi.order_id = ?',
                        [orderId]
                    );

                    await sendReceiptEmail(email, {
                        receipt_number,
                        mpesa_receipt,
                        total_amount: amount,
                        date: new Date(),
                        items
                    });
                }
            }
        } catch (err) {
            console.error('Error processing callback db update:', err);
        }
    } else {
        console.log(`Payment failed or cancelled: ${ResultDesc}`);
    }

    res.status(200).json({ ResultCode: 0, ResultDescription: "Success" });
});

module.exports = router;
