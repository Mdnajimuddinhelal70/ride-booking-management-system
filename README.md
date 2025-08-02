# 🚖 Ride Booking System

A backend server for a ride booking system built with **TypeScript**, **Express.js**, and **MongoDB**, designed to support **riders**, **drivers**, and **admins**. It includes secure authentication, role-based access, ride management, and more.

---

## 📌 Project Overview

This is a complete backend system for a ride booking platform where:

- Riders can request rides.
- Drivers can accept/reject rides and update statuses.
- Admins can monitor users and block/unblock any user.

JWT-based authentication, modular code structure, and RESTful APIs ensure clean, scalable architecture.

---

## 🚀 Features

- ✅ Rider registration and login
- ✅ JWT-based authentication & authorization
- ✅ Role-based route protection (rider, driver, admin)
- ✅ Request, accept, reject, cancel rides
- ✅ Track ride status lifecycle
- ✅ Drivers can update availability
- ✅ Calculate driver earnings
- ✅ Admins can block/unblock users

---

## 🛠 Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Token)
- **Hosting:** Vercel (Frontend), Render / Railway (API)

---

## 📫 API Endpoints with Descriptions

### 🔐 Auth Endpoints

- `POST /api/v1/user/register` → Register a new user (rider, driver)
- `POST /api/v1/auth/login` → Login and receive JWT token

---

### 👤 User Endpoints

- `GET /api/v1/user/me` → Get current logged-in user info
- `GET /api/v1/user/all-users` → (Admin only) Get all users
- `PATCH /api/v1/user/block-unblock/:id` → Block/unblock a user (admin only)

---

### 🚘 Ride Endpoints

- `POST /api/v1/ride/request` → Rider requests a ride (auto-matches with available driver)
- `PATCH /api/v1/ride/:rideId/cancel` → Cancel a ride by ID (rider only before acceptance)
- `PATCH /api/v1/ride/:rideId/accept` → Driver accepts ride
- `PATCH /api/v1/ride/:rideId/reject` → Driver rejects ride
- `PATCH /api/v1/ride/status/:rideId` → Update ride status (picked_up, in_transit, completed)
- `GET /api/v1/ride/earnings` → Driver's total earnings

---

### 🚦 Driver Endpoints

- `PATCH /api/v1/driver/availability` → Update driver's availability (online, busy, offline)

---

## 🔗 Live API Base URL

```
https://ride-booking-system-eta.vercel.app
```

Example Full Route:

```
https://ride-booking-system-eta.vercel.app/api/v1/ride/request
```

---

## ✅ Testing Tips

Use Postman or any API testing tool with the following:

- Add token in Authorization header → `Bearer <accessToken>`
- Use proper method (GET, POST, PATCH)
- Send JSON body for POST/PATCH requests

---

- **Najim Uddin Helal** —Next-level Student
