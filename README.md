# Ride Booking System API

A basic ride booking and management system built using Node.js, Express, TypeScript, MongoDB, and Mongoose.

## Features

- Rider can request a ride by providing pickup and destination locations.
- Drivers can update their availability (online/offline).
- Admin can approve drivers.
- Rides go through multiple statuses:
  - requested → accepted → picked_up → in_transit → completed / cancelled
- Each ride keeps a full status history (with timestamp).
- Only Admin or Assigned Driver can update the ride status.
- Role-based authentication: Rider, Driver, Admin.
- Only authenticated users can access protected routes.
- Proper validation and error handling.

## User Roles

### 1. Rider

- Can request rides.
- Can view their own ride history.

### 2. Driver

- Can update availability (online/offline).
- Can update ride status if assigned.
- Cannot access admin or rider-specific routes.

### 3. Admin

- Can approve drivers.
- Can update ride statuses.
- Can block or manage users.

## Core Endpoints (Examples)

- `POST /api/v1/auth/register` → User registration
- `POST /api/v1/auth/login` → Login
- `POST /api/v1/ride/request` → Rider requests a ride
- `PATCH /api/v1/ride/status/:rideId` → Admin/Driver updates ride status
- `PATCH /api/v1/driver/availability/:id` → Driver updates availability
- `PATCH /api/v1/driver/approve/:id` → Admin approves driver

## Business Rules

- Suspended or unapproved drivers cannot accept rides.
- Only one active ride per rider at a time.
- Drivers must be online to accept or update rides.
- Ride status is logged with history.
- Only allowed statuses are accepted; invalid ones are rejected.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT for Authentication
- REST API conventions
