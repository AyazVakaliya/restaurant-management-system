# Gourmet Palace - Restaurant Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for restaurant management, featuring real-time ordering, reservations, and an admin dashboard.

## Features
- **Customers**: Browse menu, online ordering, real-time tracking, table reservations.
- **Admin**: Sales analytics, order management, menu CRUD, reservation handling.
- **Tech**: Socket.io (real-time), Redux Toolkit (state), Tailwind CSS (UI), JWT (auth).

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB installed and running locally (or a MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env file based on the example provided in the code
# Run seed script to populate menu
node seedData.js
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables (.env)
- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: Any random string for token signing.
- `STRIPE_SECRET_KEY`: Your Stripe testing key (optional for demo).
- `FRONTEND_URL`: Usually `http://localhost:5173` for Vite.

## Admin Access
- To access admin features, register a user and manually change their `role` to `admin` in the MongoDB database collection `users`.

## License
MIT