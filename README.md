# 🚀 GigFlow – Mini Freelance Marketplace Platform

GigFlow is a full-stack mini freelance marketplace where users can post jobs (gigs) and freelancers can bid on them.  
Clients can hire freelancers, and freelancers receive **real-time notifications** when they are hired.

This project was built as part of a **Full Stack Development Internship Assignment**.

---

## 🔥 Live Demo

- Frontend: https://your-frontend-link.vercel.app
- Backend: https://your-backend-link.onrender.com

📽 **Demo Video (Loom)**: https://loom.com/your-video-link

---

## 🛠 Tech Stack

### Frontend

- React.js (Vite)
- Tailwind CSS
- Redux Toolkit
- Axios
- Socket.io Client

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication (HttpOnly Cookies)
- Socket.io
- MongoDB Transactions

---

## ✨ Features

### 🔐 Authentication

- Secure Sign Up & Login
- JWT-based authentication using HttpOnly cookies
- Role-free system (any user can post or bid)

### 📌 Gig Management

- Create, Read, Update, Delete Gigs
- Browse all open gigs
- Search gigs by title

### 💬 Bidding System

- Freelancers can place bids with price & message
- Clients can view all bids on their gigs

### 🤝 Hiring Logic (Atomic)

- Client can hire only **one** freelancer
- Gig status changes from `open` → `assigned`
- Selected bid becomes `hired`
- All other bids are automatically `rejected`
- Protected against race conditions using MongoDB transactions

### 🔔 Real-Time Notifications (Bonus)

- Socket.io integration
- Freelancer receives instant notification:
  > “You have been hired for [Gig Title]”
- No page refresh required

---

## 📁 Project Structure
