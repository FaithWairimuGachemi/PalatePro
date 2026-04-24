const nodemailer = require('nodemailer');

const sendReceiptEmail = async (email, orderDetails) => {
  try {
    // We create a test account since we don't have real SMTP credentials.
    // Ethereal is a fake SMTP service perfect for testing.
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, 
      auth: {
        user: testAccount.user, 
        pass: testAccount.pass, 
      },
    });

    const { receipt_number, mpesa_receipt, total_amount, date, items } = orderDetails;

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">KSh ${item.price}</td>
      </tr>
    `).join('');

    const mailOptions = {
        from: '"PalatePro Orders" <orders@palatepro.com>',
        to: email,
        subject: `Your PalatePro Receipt - Order #${receipt_number}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h1 style="color: #ff4757; text-align: center;">PalatePro</h1>
                <h2 style="text-align: center;">Payment Receipt</h2>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <p><strong>Receipt Number:</strong> ${receipt_number}</p>
                    <p><strong>Date & Time:</strong> ${new Date(date).toLocaleString()}</p>
                    <p><strong>M-Pesa Code:</strong> ${mpesa_receipt}</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: #f1f2f6;">
                            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total Paid:</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold; color: #ff4757;">KSh ${total_amount}</td>
                        </tr>
                    </tfoot>
                </table>

                <p style="text-align: center; color: #7f8fa6; font-size: 0.9em;">
                    Thank you for dining with PalatePro!<br>
                    Enjoy your meal!
                </p>
            </div>
        `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Receipt sent to ${email}`);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

module.exports = {
  sendReceiptEmail
};
