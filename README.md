# 🍽️ PalatePro - Taste the Magic

PalatePro is a premium full-stack food delivery application designed to offer a seamless culinary experience. From authentic Kenyan delicacies to a state-of-the-art admin command center, PalatePro redefines how food is ordered, paid for, and delivered.

---

## 🚀 Vision
To bridge the gap between world-class culinary art and the convenience of modern technology, starting with the vibrant flavors of Kenya.

---

## 📸 Project Gallery
<img width="1920" height="1080" alt="Screenshot_2026-04-28_12_03_20" src="https://github.com/user-attachments/assets/04bfe8be-8c8b-4dd0-b347-7ba2ea6ad4ab" />
<img width="1920" height="1080" alt="Screenshot_2026-04-28_12_03_50" src="https://github.com/user-attachments/assets/86544efc-c049-4e81-8be8-67935736575c" />
<img width="1920" height="1080" alt="Screenshot_2026-04-28_12_02_39" src="https://github.com/user-attachments/assets/4d1af692-338c-4a96-aebb-47e274dde040" />
<img width="1920" height="1080" alt="Screenshot_2026-04-28_12_02_46" src="https://github.com/user-attachments/assets/2e92cd1b-8e37-44e8-bb5a-63ef07ea0713" />
<img width="1920" height="1080" alt="Screenshot_2026-04-28_12_01_43" src="https://github.com/user-attachments/assets/fa91d90b-ade4-4f3b-9721-666acf680ceb" />
<img width="1920" height="1080" alt="Screenshot_2026-04-28_12_04_13" src="https://github.com/user-attachments/assets/1463fa1a-133d-4e8e-8dd5-95cf5e098d16" />


### 🏠 Landing Page
<img width="1920" height="1080" alt="Screenshot_2026-04-28_12_01_43" src="https://github.com/user-attachments/assets/f0f5918f-3dfc-4d28-85c7-42e26acf712a" />
> <img width="1920" height="1080" alt="Screenshot_2026-04-28_12_02_09" src="https://github.com/user-attachments/assets/4ed03295-dbf2-4507-bb24-ac449f2f9432" />



### 🍕 The Menu
> <img width="1920" height="1080" alt="Screenshot_2026-04-28_12_02_39" src="https://github.com/user-attachments/assets/5f2eedab-6d62-404c-9c64-7deb5cefd0d5" />
<img width="1920" height="1080" alt="Screenshot_2026-04-28_12_02_58" src="https://github.com/user-attachments/assets/87dc53b1-6105-4e0c-9be8-055efc7ffeec" />


### 📱 Mobile Experience
>> <img width="714" height="1599" alt="ba7054c5-0856-428e-8434-8de3e83768e4" src="https://github.com/user-attachments/assets/7aa1236f-63aa-47ee-997b-7698e757fd26" />
<img width="714" height="1599" alt="d1a17702-0774-4619-966d-5be63a3db9ed" src="https://github.com/user-attachments/assets/f9537a52-e0f2-4964-aa9d-225250a7d125" />
<img width="714" height="1599" alt="beb8a01c-e833-4278-aed3-f75a7dbdfcaf" src="https://github.com/user-attachments/assets/ab3819d0-d552-474c-928d-6b4ec7640fe5" />

### 🤖 PalatePro AI Assistant
> **[Screenshot Needed: The floating AI chat window giving a personalized recommendation like "Since you love spicy food, I recommend the Pilau!"]**

### 📊 Admin Console

<img width="962" height="925" alt="image" src="https://github.com/user-attachments/assets/11bdc517-9cce-4086-a1b0-8a18d95bb140" />



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

### 🤖 PalatePro AI Assistant
*   **Personalized Recommendations:** Powered by Google Gemini, the AI analyzes your food preferences and past ordering patterns to suggest the perfect meal.
*   **Menu Awareness:** The assistant only recommends items that are currently in stock and available on the menu.
*   **Interactive Chat:** A sleek floating assistant available on every page to answer your culinary questions.

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
