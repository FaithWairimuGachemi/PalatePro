# 🍽️ PalatePro - Taste the Magic

PalatePro is a premium full-stack food delivery application designed to offer a seamless culinary experience. From authentic Kenyan delicacies to a state-of-the-art admin command center, PalatePro redefines how food is ordered, paid for, and delivered.

---

## 🚀 Vision
To bridge the gap between world-class culinary art and the convenience of modern technology, starting with the vibrant flavors of Kenya.

---

## 📸 Project Gallery
*(Screenshots to be added)*

### 🏠 Landing Page
> **[Screenshot Needed: The Hero section with the floating PalatePro burger and the "Taste the Magic" title]**

### 🍕 The Menu
> **[Screenshot Needed: The categorized menu showing Pilau, Nyama Choma, and the "Recommended for You" section]**

### 📱 Mobile Experience
> **[Screenshot Needed: The PalatePro application running on an Android or iOS device]**

### 📊 Admin Console
> **[Screenshot Needed: The Sales Overview dashboard with real-time transaction reports and M-Pesa codes]**

---

## ✨ Features

### 🛒 Seamless Checkout
*   **M-Pesa Integration:** Fully automated STK Push payments using the Safaricom Daraja API.
*   **Real-time Callbacks:** Automated order status updates (PENDING to PAID) upon successful transaction.

### 📧 Automated receipting
*   **Professional HTML Receipts:** Instant receipt generation sent directly to the customer's email.
*   **Nodemailer Integration:** Powered by Gmail SMTP for reliable delivery.

### 🍱 Authentic Kenyan Menu
*   **Curated Selection:** 30+ professionally photographed and described Kenyan dishes.
*   **Smart Fallbacks:** A resilient data layer that ensures the menu is always visible, even during database maintenance.

### 🛠️ Admin Command Center
*   **Real-time Analytics:** Track sales, popular items, and customer trends.
*   **Order Management:** Process and track order statuses from "Paid" to "Delivered".
*   **Rescue Access:** A failsafe login system for 24/7 administrative control.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, CSS (Vanilla Custom) |
| **Backend** | Node.js, Express |
| **Database** | MySQL (Aiven Cloud) |
| **Mobile** | Capacitor (Hybrid Android/iOS) |
| **Payment** | Safaricom Daraja (M-Pesa) |
| **Email** | Nodemailer (Gmail SMTP) |

---

## ⚙️ Setup & Installation

### 1. Prerequisites
*   Node.js (v18 or higher)
*   MySQL Server (Local or Cloud)

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory with the following variables:
```env
# Database
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_db

# M-Pesa
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password

# Security
JWT_SECRET=your_secret_key
```

### 3. Running the Application
```bash
# Start Backend
cd backend
npm install
node server.js

# Start Frontend
cd frontend
npm install
npm run dev
```

---

## 👨‍💻 Admin Credentials
To access the reporting dashboard:
*   **Phone:** `+254797460219`
*   **Password:** `admin1pass`

---

## 🤝 Contributing
Built with ❤️ by the PalatePro Team. 

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
