# Italia Restaurant

A full-stack Italian restaurant ordering web app. Browse a seeded menu, sign up / log in, add items to a cart with customizations, place orders, and view your order history.

Built with React 19 + Vite on the frontend and Express + MongoDB (Mongoose) on the backend, served together from a single Node process.

## Features

- **Menu browsing** — 15 pre-seeded Italian dishes with name, description, price, image, and a `taste` tag (savory, sweet, spicy, sour, bitter)
- **Authentication** — signup/login with bcrypt password hashing and JWT sessions (7-day expiry)
- **Cart & order customization** — add items, customize, and check out
- **Order history** — authenticated users can view their past orders
- **Contact & feedback forms** — messages are stored in MongoDB

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite 6, Tailwind CSS 4, Framer Motion, Lucide Icons |
| Backend | Express 4 (TypeScript), run via `tsx` |
| Database | MongoDB via Mongoose — falls back to an in-memory MongoDB instance (`mongodb-memory-server`) if no `MONGODB_URI` is set |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Testing | Jest + Supertest (`tests/auth.test.ts`, `menu.test.ts`, `orders.test.ts`) |
| Build | Vite (client) + esbuild (bundles `server.ts` → `dist/server.cjs`) |

The app runs as a **single server**: Express mounts Vite as middleware in dev (or serves the built static files in production) on one port, so there's no separate frontend/backend port split.

## Getting Started

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in values (see [Environment Variables](#environment-variables)). None are strictly required for local dev — the app will fall back to an in-memory database.
3. Run the app:
   ```bash
   npm run dev
   ```
   The server starts on **http://localhost:3000**.

### Other scripts

| Command | Purpose |
|---|---|
| `npm run build` | Build the client with Vite and bundle `server.ts` with esbuild into `dist/server.cjs` |
| `npm start` | Run the production build (`node dist/server.cjs`) |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm test` | Run the Jest test suite |
| `npm run clean` | Remove `dist/` |

## Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | No | If unset, an in-memory MongoDB instance is spun up automatically and the menu is auto-seeded |
| `JWT_SECRET` | Recommended | Falls back to a hardcoded dev secret (`italia-fallback-secret-key-12345`) if unset — **set this in production** |
| `GEMINI_API_KEY` | No (unless using Gemini features) | Listed in `.env.example`; used if/when Gemini API calls are added |
| `APP_URL` | No | Used for self-referential links; auto-injected when hosted on AI Studio / Cloud Run |

> ⚠️ The default `JWT_SECRET` fallback is committed in source and should never be relied on outside local development.

## API Reference

All routes are prefixed with `/api`. Routes marked 🔒 require an `Authorization: Bearer <token>` header.

### Auth (`/api/auth`)
| Method | Path | Description |
|---|---|---|
| POST | `/signup` | Create an account (`name`, `email`, `password` — password ≥ 8 chars) |
| POST | `/login` | Log in with `email` + `password`, returns a JWT |
| GET | `/me` 🔒 | Get the current authenticated user |

### Menu (`/api/menu`)
| Method | Path | Description |
|---|---|---|
| GET | `/` | List all menu items |
| GET | `/:id` | Get a single menu item |

### Orders (`/api/orders`)
| Method | Path | Description |
|---|---|---|
| POST | `/` 🔒 | Place an order (`items: [{ menuItemId, quantity, customization? }]`) — prices are re-validated server-side against the menu |
| GET | `/me` 🔒 | Get the authenticated user's order history, most recent first |

### Contact (`/api/contact`)
| Method | Path | Description |
|---|---|---|
| POST | `/` | Submit a contact message (`name`, `email`, `message`) |

### Feedback (`/api/feedback`)
| Method | Path | Description |
|---|---|---|
| POST | `/` | Submit feedback (`message`, optional `rating`) |

## Project Structure

```
src/                    React frontend
├── components/         Header, Footer, Home, About, Menu, Cart,
│                        OrderCustomization, OrderConfirmation, OrderHistory,
│                        SignUpLogin, Contact, Feedback, ProfileModal
├── context/             AuthContext, CartContext
├── api/client.ts        API client for backend calls
└── App.tsx               Route definitions

server/                 Express backend
├── app.ts                Express app + route mounting
├── db.ts                  MongoDB connection + menu seeding
├── middleware/auth.ts     JWT auth middleware
├── models/               User, MenuItem, Order, ContactMessage, FeedbackMessage
└── routes/                auth, menu, orders, contact, feedback

server.ts               Top-level entrypoint (Vite middleware in dev / static serving in prod)
tests/                  Jest + Supertest test suites
```

## Testing

```bash
npm test
```

Runs Jest in-band against `tests/auth.test.ts`, `tests/menu.test.ts`, and `tests/orders.test.ts`.

## Notes

- Originally scaffolded via Google AI Studio; the `@google/genai` dependency and `GEMINI_API_KEY`/`APP_URL` env vars are present for potential Gemini integration but not currently wired into any route.
- The menu is auto-seeded with 15 dishes (pizzas, pastas, desserts, etc.) the first time the server connects to an empty database.
