# 🚗 Ride Booking API

A secure, scalable, and role-based backend API for a ride booking system like Uber/Pathao, built using **Node.js**, **Express**, and **MongoDB (Mongoose)**.

---

## 🎯 Project Overview

This API allows:
- 🧍 **Riders** to request/cancel rides and view history
- 🚗 **Drivers** to accept rides, update ride statuses, view earnings, and toggle availability
- 👮 **Admins** to manage users, drivers, and rides, including approvals, blocks, and reports

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based login with role-based access (`rider`, `driver`, `admin`)
- Secure password hashing with **bcrypt**
- Middleware-based role protection

### 🧍 Rider Features
- Request a ride with pickup & destination coordinates
- Cancel a ride (before acceptance)
- View ride history

### 🚗 Driver Features
- Accept or reject ride requests
- Update ride status: `ACCEPTED → PICKED_UP → IN_TRANSIT → COMPLETED`
- View total earnings and ride history
- Go `Online/Offline`

### 👮 Admin Features
- View all users, drivers, rides
- Approve/suspend/block drivers and riders
- Generate ride reports (optional)

---

## 🧠 System Design Notes

- **Ride Matching:** Auto-matching nearby driver in 10km
- **Ride Status Flow:** `REQUESTED → ACCEPTED → PICKED_UP → IN_TRANSIT → COMPLETED/CANCELED`
- **Timestamps:** Logged for each status change
- - **Rider Constraints:**
  - Cannot request multiple rides at once
- **Driver Constraints:**
  - Must be approved and available
- **Cancel Rules:**
  - Rider can only cancel before driver accepts
  - Driver/admin can cancel any time

---


## 📦 Tech Stack

- **Node.js + Express** (RESTful API)
- **MongoDB + Mongoose** (Database + ODM)
- **JWT** (Authentication)
- **bcryptjs** (Password hashing)
- **TypeScript** (Optional but recommended)

---

## 🔐 Role-Based Route Protection

| Role   | Access                                                                 |
|--------|------------------------------------------------------------------------|
| Rider  | Request/Cancel ride, View ride history                                 |
| Driver | Accept/Reject ride, Update status, View earnings, Toggle availability  |
| Admin  | Approve/Suspend users, View all rides/users                            |

---

## 📡 API Endpoints Summary

### 🧍 Rider

| Method | Endpoint                  | Description                |
|--------|---------------------------|----------------------------|
| POST   | `/user/register`          | Register as rider          |
| POST   | `/auth/login`             | Login and get JWT          |
| POST   | `/ride/request`           | Request a new ride         |
| PATCH  | `/ride/set-status/:id`    | Cancel or complete a ride  |
| GET    | `/ride/my-rides`          | Get past rides             |

---

### 🚗 Driver

| Method | Endpoint                     | Description                        |
|--------|------------------------------|------------------------------------|
|POST  | `/driver/register`           | Request to be a driver               |
| GET | `/ride/my-requested`          | Get my all requested ride               |
|PATCH   | `/ride/set-status/:id`          | Cancel or Set any status                |
| GET    | `/driver/earnings`          | Get total earnings                 |
| GET    | `/driver/ride-history`      | Driver ride history                |

---

### 👮 Admin

| Method | Endpoint                      | Description                   |
|--------|-------------------------------|-------------------------------|
| GET    | `/user`                | View all users                |
| GET    | `/driver`                | View all drivers              |
| GET    | `/ride`                | View all rides            |
| GET    | `/driver/all-driver-request` | View all driver request|
| PATCH    | `/driver/request-handle/:id` | Handle driver request|
| GET    | `/user/single/:id`                | View user rides     |
| GET    | `/ride/single/:id`                | View user rides     |

---



## 📁 Project Structure
```
src/
├── app.ts                      # Express app setup (middleware, routes)
├── server.ts                   # Entry point (starts server)
│
├── config/                     # ⚙️ Configuration files
│   └── db.ts                   # MongoDB connection
│
├── app/                        # 🧠 Main application logic
│
│   ├── modules/                # 📦 Feature-based modules
│   │   ├── auth/               # Authentication (JWT, login, register)
│   │   ├── user/               # Shared user logic
│   │   ├── driver/             # Driver-specific logic
│   │   └── ride/               # Ride lifecycle management
│
│   ├── middlewares/            # 🛡️ Global and route-specific middleware
│   │   ├── checkAuth.ts
│   │   ├── rglobalErrorHandler.ts
│   │   ├── valiadteRequest.ts
│   │   └── notFound.ts
│
│   ├── utils/                  # ⚙️ Utility functions
│   │   ├── calculateDistance.ts
│   │   ├── QueryBuilder.ts
│   │   ├── catchAsync.ts
│   │   └── sendResponse.ts
│
│   ├── routes/                 # 🚦 Route aggregator
│   │   └── index.ts
├── .env                            # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```



Let me know if you also want:
- 📦 A complete **Postman collection**
- 📁 Full backend code scaffold (routes, models, controllers)
- 🐳 Docker setup
- 🧪 Swagger/OpenAPI Docs

I'll generate those too.


```bash
git clone https://github.com/pmppiyas/Ride_Share_System_Backend.git
cd Ride_Share_System_Backend
