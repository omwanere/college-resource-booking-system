📘 College Resource Booking System

A full-stack web application that provides a centralized, role-based platform for managing and booking college resources such as classrooms, labs, and auditoriums.

🚩 Problem Statement

In many colleges, resource booking is handled manually through emails, spreadsheets, or verbal coordination, which often leads to:

Double bookings

Lack of transparency

Delays in approval

No centralized tracking system

✅ Solution Overview

This project solves the above issues by providing:

A centralized booking system

Role-based access for Users and Admins

Admin approval workflow to prevent conflicts

Real-time booking status tracking for users

🧠 System Architecture (High Level)
Frontend (Angular)
   |
   |  REST APIs (JWT Auth)
   |
Backend (Node.js + Express)
   |
   |  SQL Queries
   |
Database (PostgreSQL)


Frontend handles UI, routing, and API consumption

Backend handles business logic, authentication, and validation

Database ensures reliable and consistent data storage

🧑‍💻 User Roles
👤 USER

Register and login

View available resources

Check availability for a date

Request bookings

Track booking status (Pending / Approved / Rejected)

🛡️ ADMIN

View all pending booking requests

Approve or reject bookings

Manage booking conflicts centrally

🛠️ Tech Stack
Frontend

Angular

Angular Material

TypeScript

JWT-based authentication

Backend

Node.js

Express.js

PostgreSQL

JWT (JSON Web Tokens)

bcrypt (password hashing)

Database

PostgreSQL

UUID-based primary keys

Relational schema with foreign keys

📂 Project Structure
college-resource-booking-system/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── app.js
│   ├── sql/
│   │   └── schema.sql
│   └── package.json
│
├── frontend/
│   ├── src/app/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── guards/
│   │   └── shared/
│   └── package.json
│
└── README.md

🔐 Authentication & Authorization

JWT tokens are generated on login

Tokens are stored on the client and sent via Authorization headers

Route Guards enforce:

Login protection

Admin-only access for approval routes

🗄️ Database Design

Core tables:

users → stores user and admin accounts

resources → stores college resources

bookings → stores booking requests and statuses

Schema is available at:

backend/sql/schema.sql

▶️ How to Run the Project Locally
1️⃣ Clone the Repository
git clone https://github.com/omwanere/college-resource-booking-system.git
cd college-resource-booking-system

2️⃣ Backend Setup
cd backend
npm install


Create .env file:

PORT=8000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=college_resource_booking
JWT_SECRET=your_secret_key


Run backend:

npm run dev

3️⃣ Frontend Setup
cd ../frontend
npm install
ng serve


Frontend runs at:

http://localhost:4200

🧪 Key Features Tested

User registration & login

JWT authentication

Role-based route protection

Resource listing & availability checks

Booking creation & conflict prevention

Admin approval/rejection flow

User dashboard booking tracking

⚠️ Known Limitations & Future Improvements

Dynamic time-slot selection can be enhanced

Email notifications (e.g., Nodemailer) can be added

Pagination for large booking data

Booking cancellation by users

Deployment-ready CI/CD setup

🎯 Learning Outcomes

Built a real-world booking system end-to-end

Gained hands-on experience with Angular standalone components

Implemented role-based authorization using JWT

Designed relational schemas and RESTful APIs

Improved debugging and frontend-backend integration skills

👨‍💻 Author

Om Wanere
Final Year Engineering Student
GitHub: https://github.com/omwanere