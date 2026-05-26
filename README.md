# Delivery Management Backend API

## Overview

This project is a backend API for a Delivery Management System built using Node.js, Express.js, and MySQL.

The system supports:
- JWT Authentication
- Role-based access control
- Order management
- Delivery boy assignment
- Refresh token handling
- MySQL database integration

---

# Tech Stack

- Node.js
- Express.js
- MySQL
- JWT Authentication
- dotenv

---

# Folder Structure

```bash
src/
│── config/
│   └── db.js
│
│── controllers/
│   ├── assignmentController.js
│   ├── authController.js
│   ├── deliveryBoyController.js
│   └── orderController.js
│
│── middleware/
│   └── authMiddleware.js
│
│── routes/
│   ├── assignmentRoutes.js
│   ├── authRoutes.js
│   ├── deliveryBoyRoutes.js
│   └── orderRoutes.js
│
├── .env
├── .env.example
├── schema.sql
├── server.js
├── package.json
```

---

# Setup Project Locally

## 1. Clone Repository

```bash
git clone <repository_url>
cd <project_folder>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the root directory using `.env.example`.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=delivery_db

JWT_ACCESS_SECRET=my_access_secret
JWT_REFRESH_SECRET=my_refresh_secret

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

---

# Environment Variables Explanation

| Variable | Description |
|----------|-------------|
| PORT | Server running port |
| DB_HOST | MySQL host |
| DB_USER | MySQL username |
| DB_PASSWORD | MySQL password |
| DB_NAME | Database name |
| JWT_ACCESS_SECRET | Secret key for access token |
| JWT_REFRESH_SECRET | Secret key for refresh token |
| ACCESS_TOKEN_EXPIRY | Access token expiry time |
| REFRESH_TOKEN_EXPIRY | Refresh token expiry time |

---

# Database Setup

## 1. Create Database

Open MySQL and run:

```sql
CREATE DATABASE delivery_db;
```

---

## 2. Run schema.sql

Using terminal:

```bash
mysql -u root -p delivery_db < schema.sql
```

Or import `schema.sql` manually using MySQL Workbench.

---

# Database Schema

## Users Table

Stores admin and delivery boy details.

## Orders Table

Stores customer order information.

## Assignments Table

Stores delivery boy assignments for orders.

## Refresh Tokens Table

Stores refresh tokens for JWT authentication.

---

# Run the Server

```bash
npm start
```

For development mode:

```bash
npm run dev
```

---

# API Documentation

# Authentication APIs

## Register User

### Endpoint

```http
POST /api/auth/register
```

### Sample Request

```json
{
  "name": "Dev",
  "email": "dev@gmail.com",
  "password": "123456",
  "role": "admin"
}
```

---

## Login User

### Endpoint

```http
POST /api/auth/login
```

### Sample Request

```json
{
  "email": "dev@gmail.com",
  "password": "123456"
}
```

---

# Orders APIs

## Create Order

### Endpoint

```http
POST /api/orders/create
```

### Sample Request

```json
{
  "customer_name": "Dev",
  "pickup_address": "Delhi",
  "delivery_address": "Noida"
}
```

---

## Get All Orders

### Endpoint

```http
GET /api/orders
```

---

# Assignment APIs

## Assign Delivery Boy

### Endpoint

```http
POST /api/assignments/assign
```

### Sample Request

```json
{
  "order_id": 1,
  "delivery_boy": 2
}
```

---

# Delivery Boy APIs

## Get Assigned Orders

### Endpoint

```http
GET /api/delivery-boy/orders
```

---

# Authentication

Protected routes require JWT token in headers.

Example:

```http
Authorization: Bearer <access_token>
```

---

# Future Improvements

- Real-time order tracking
- Email notifications
- Admin dashboard
- Docker support
- Rate limiting
- API documentation using Swagger

---

# Author

Developed by Parth Manocha