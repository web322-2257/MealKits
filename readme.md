#  Meal Kits

A full-stack meal kit delivery platform inspired by Factor 75, allowing users to browse curated meal options, manage subscriptions, and purchase pre-portioned meal kits with secure checkout and order management.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green)


---

## Overview

Meal Kits is a comprehensive e-commerce platform that brings the convenience of meal kit delivery services to your kitchen. Users can explore weekly menus, customize their meal selections, and have fresh, pre-portioned ingredients delivered to their door.

---

## Key Features

###  User Shopping Experience
- Browse weekly rotating meal menus with detailed recipes and nutritional information
- Add meals to cart with portion size customization (2-person, 4-person servings)
- Secure checkout with session-based cart persistence
- Order history and tracking dashboard

### Authentication & Security
- Secure user authentication with session management
- Password hashing and validation
- Role-based access control (Customer, Data Clerk, Admin)
- MongoDB for secure data storage with encrypted sensitive information

### Data Clerk Portal
- Add, edit, and remove meals from the menu
- Update meal descriptions, ingredients, and pricing
- Manage recipe instructions and cooking times
- Upload and manage meal images

### Payment & Orders
- Session-based shopping cart with automatic save
- Secure order processing


---

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- EJS templating engine
- MongoDB with Mongoose ODM
- Express-session for session management

**Frontend:**
- EJS templates
- TailwindCSS with DaisyUI for responsive, clean design

**Security:**
- bcrypt for password hashing
- express-session for secure sessions
- MongoDB connection encryption

---

##  Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas cluster)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mealkits.git
cd meal-kits
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret_key
PORT=3000
```

4. **Run the application**
```bash
npm start
```

5. **Access the app**
Navigate to `http://localhost:3000](https://web322-project-2257-bmar1.vercel.app` in your browser

---

##  Contributing

Contributions are welcome! Please contact me.
---

## Acknowledgments

- Inspired by Factor 75 and other meal kit delivery services
- Built with modern web development best practices
