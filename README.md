# Italia Restaurant

A full-stack Italian restaurant ordering web app. Browse a seeded menu, sign up / log in, add items to a cart with customizations, place orders, and view your order history.

Built with React 18 + Vite on the frontend and Express + MongoDB (Mongoose) on the backend, served together from a single Node process.

## Features

- **Menu browsing** — 15 pre-seeded Italian dishes with name, description, price, image, and a `taste` tag (savory, sweet, spicy, sour, bitter)
- **Authentication** — signup/login with bcrypt password hashing and JWT sessions (7-day expiry)
- **Cart & order customization** — add items, customize ingredients, and check out
- **Order history** — authenticated users can view their past orders
- **Contact & feedback forms** — messages are stored in MongoDB
- **Soft, warm design** — earth-tone palette with serif display typography, WCAG AA contrast, and a consistent brand token system

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 7, Vite 6, Tailwind CSS 4, Motion, Lucide Icons |
| Backend | Express 4 (TypeScript), run via `tsx` |
| Database | MongoDB via Mongoose — falls back to an in-memory MongoDB instance (`mongodb-memory-server`) if no `MONGODB_URI` is set |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Testing | Jest + Supertest (`tests/auth.test.ts`, `menu.test.ts`, `orders.test.ts`) |
| Build | Vite (client) + esbuild (bundles `server.ts` → `dist/server.cjs`) |

The app runs as a **single server**: Express mounts Vite as middleware in dev (or serves the built static files in production) on one port, so there's no separate frontend/backend port split.

## Design System

The UI uses a **soft, warm earth-tone palette** defined as semantic CSS custom properties via Tailwind CSS v4's `@theme` directive in `src/index.css`.

### Typography

| Role | Font |
|---|---|
| Body / sans | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) |
| Display / serif | [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) |
| Monospace | [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) |

### Brand Tokens

| Token | Hex | Description |
|---|---|---|
| `brand-bg` | `#F8F7F4` | Warm Linen White — page background |
| `brand-ink` | `#26211C` | Deep Espresso Black — body text |
| `brand-primary` | `#94644D` | Rich Terracotta — buttons, accents, links |
| `brand-hover` | `#7D5340` | Deep Clay — hover state for primary |
| `brand-green` | `#6B9466` | Balanced Sage — success states, badges |
| `brand-gold` | `#A67F42` | Rich Honey Gold — star ratings, highlights |
| `brand-dark` | `#4A3F36` | Rich Espresso — dark section backgrounds |
| `brand-border` | `#DDD7CE` | Warm Oat — borders and dividers |

All tokens are WCAG AA compliant at normal text sizes against their intended backgrounds.

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
| `JWT_SECRET` | **Yes** (production) | **Required in production** — the server will throw at startup if unset. In development, a loud warning is logged and an insecure fallback is used. Generate with `openssl rand -hex 32`. |
| `GEMINI_API_KEY` | No (unless using Gemini features) | Listed in `.env.example`; used if/when Gemini API calls are added |
| `APP_URL` | No | Used for self-referential links; auto-injected when hosted on AI Studio / Cloud Run |

> ⚠️ In production, `JWT_SECRET` is **mandatory** — the server refuses to start without it. In development/test, a clearly-labelled insecure fallback is used and a warning is printed to the console.

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
├── index.css            Tailwind v4 @theme tokens, fonts, global styles
└── App.tsx               Route definitions

server/                 Express backend
├── app.ts                Express app + route mounting
├── config.ts             Centralized env config (JWT_SECRET validation)
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
- Licensed under the [MIT License](LICENSE).

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
