# Italia Restaurant — Full-Stack Ordering App

A full-stack restaurant ordering web application with user authentication, menu browsing, cart management, order placement, order history, and customer feedback.

## Features

- **User authentication** — signup/login with JWT-based sessions and bcrypt password hashing
- **Menu browsing** — view dishes with details and customization options
- **Cart & checkout** — add items, customize orders, and place them
- **Order history** — view past orders per user
- **Contact & feedback forms** — persisted to the database
- **Automated tests** — Jest + Supertest coverage for auth, menu, and order routes

## Tech Stack

**Frontend:** React 19, TypeScript, React Router, Tailwind CSS, Vite
**Backend:** Node.js, Express, better-sqlite3
**Auth:** JWT, bcrypt
**Testing:** Jest, Supertest

## Project Structure

```
src/
  components/    UI components (Menu, Cart, Header, Footer, etc.)
  context/       Auth and Cart context providers
  api/           API client for backend communication
server/
  routes/        Express route handlers (auth, menu, orders, contact, feedback)
  middleware/    Auth middleware
  db.ts          Database schema and connection
tests/           Jest test suites
```

## Running Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the required values.
3. Run the app:
   ```
   npm run dev
   ```
4. Run tests:
   ```
   npm test
   ```

## Database Schema

The app uses SQLite with the following core tables: `users`, `menu_items`, `orders`, `order_items`, `contact_messages`, and `feedback_messages`, with foreign key relationships linking orders to users and order items to both orders and menu items.
