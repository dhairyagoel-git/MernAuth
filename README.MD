# MERN Authentication System

A full-stack authentication system built with the MERN stack (MongoDB, Express, React, Node.js) using JSON Web Tokens (JWT) for secure authentication.

## 🔐 Features

- User Registration
- User Login
- Protected Routes (using JWT)
- Password Hashing (using bcrypt)
- Token Storage (via HTTP-only cookies or localStorage)
- Logout functionality

## 🛠 Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, bcrypt
- **Other Tools**: Postman (for testing), dotenv

## 📁 Folder Structure
root/
├── client/ # React frontend
├── server/ # Node.js + Express backend
│ ├── models/ # Mongoose models
│ ├── routes/ # Express routes
│ ├── controllers/ # Route logic
│ └── middleware/ # JWT auth middleware
├── .gitignore
├── README.md
