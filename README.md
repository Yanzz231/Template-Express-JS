# Template Express Js💻

## Description
This project is a backend template built with Express.js and Prisma, specifically designed for managing user-related routes. It provides a foundational structure for handling CRUD operations on users, making it easy to extend and integrate into larger applications.

## Features
- Express.js for fast and lightweight server-side applications.
- Prisma ORM for database operations and schema management.
- Pre-configured user routes for quick setup.
- Easy-to-extend structure for additional routes and features.

---

## Installation

```bash
1. npm i
2. npx prisma migrate dev --name create_users_table
3. node app
```

## .env

```bash
PORT=3000
JWT_SECRET=YOUR JWT TOKEN

DATABASE_URL="mysql://root@localhost:3306/Template"


EMAIL_NODEMAILER=YOUR_EMAIL
PASSWORD_NODEMAILER=YOUR_PASSWORD
```

## API Endpoints

### Base URL
```
http://localhost:3000
```

### User Routes
#### 1. Create a New User
**Endpoint**: `/api/users/register`

**Method**: POST

**Request Body**:
```json
{
  "username": "Andrian",
  "password": "Test1234",
  "email": "EMAIL@gmail.com",
  "phone": "08231XX"
}
```

#### 2. Login User
**Endpoint**: `/api/users/login`

**Method**: POST

**Request Body**:
```json
{
  "username": "EMAIL@gmail.com",
  "password": "Test1234"
}
```

#### 3. Change Password
**Endpoint**: `/api/users/change-password`

**Method**: POST

**Request Body**:
```json
{
  "email": "EMAIL@gmail.com",
  "password": "Test1234",
  "new_password": "Test12345"
}
```

#### 4. Forget-Password
**Endpoint**: `/api/users/change-password`

**Method**: POST

**Request Body**:
```json
{
  "email": "EMAIL@gmail.com"
}
```

#### 5. Verify Password
**Endpoint**: `/api/users/verify`

**Method**: POST

**Request Body**:
```json
{
  "otp": "8953",
  "email": "EMAIL@gmail.com",
  "new_password": "Test12345",
  "type": "forget-password"
}
```

#### 6. Verify OTP
**Endpoint**: `/api/users/verify`

**Method**: POST

**Request Body**:
```json
{
  "otp": "8953",
  "email": "EMAIL@gmail.com",
  "type": "verify"
}
```
---

## License

This project is under the [Yanzz](https://github.com/Yanzz231)

## Helper 🤖

Just DM me with instagram [Yanz](https://www.instagram.com/iyanmikasa/)