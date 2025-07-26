# 📊 Stocks Portfolio App

A full-stack stock tracking web app built with React, MobX, NestJS, and MongoDB — supporting real-time quote lookup, user authentication, and personalized portfolios.

---

## 📁 Monorepo Structure

```
apps/
├── client/     # React + MobX + MUI
└── server/     # NestJS + MongoDB + JWT
libs/
└── shared/     # Shared types/interfaces
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/stocks-portfolio-app.git
cd stocks-monorepo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create the following `.env` file inside `server`:

```
MONGO_URI=mongodb://localhost:27017/stocks
JWT_SECRET=your_jwt_secret
PORT=3000
```

For the frontend (`client`), create `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

---

## 🖥️ Run the App

### Full app (client + server):

```bash
npm start
```

### Individually:

* **Client (React)**

```bash
npm run start:client
```

* **Server (NestJS)**

```bash
npm run start:server
```

---

## 📦 Scripts

```json
"scripts": {
  "start": "npx nx serve client",
  "start:client": "npx nx serve client",
  "start:server": "npx nx serve server",
  "build": "npx nx build",
  "test": "npx nx test"
}
```

---

## 🔐 Authentication

* Register & Login via `/api/auth`
* JWT is stored in `localStorage` and sent with all API requests
* `Portfolio` is **user-specific**

---

## 💡 Features

✅ User registration & login
✅ JWT-protected portfolio per user
✅ MobX-powered state management
✅ Search stocks by symbol or name
✅ Add/Remove stocks to/from portfolio
✅ Real-time quote fetching with caching
✅ Fully responsive design using Material UI

---

## 💾 Quote Caching

To improve performance and reduce unnecessary API calls, the app includes **client-side quote caching**:

* Quotes are cached in memory (`PortfolioStore`) for 60 seconds.
* If a stock has already been fetched recently, the cached data is used.
* This avoids over-fetching and improves responsiveness.

---

## 📬 API Endpoints

| Method | Endpoint                       | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| POST   | `/api/auth/register`           | Register a new user                |
| POST   | `/api/auth/login`              | Login and receive JWT              |
| GET    | `/api/portfolio`               | Get user's portfolio               |
| POST   | `/api/portfolio/add`           | Add stock to user's portfolio      |
| POST   | `/api/portfolio/remove`        | Remove stock from user's portfolio |
| GET    | `/api/portfolio/quote/:symbol` | Get quote info for given symbol    |

---

## 🛠️ Tech Stack

* ⚛️ React + TypeScript
* 🧠 MobX for global state
* 🎨 Material UI (MUI)
* 🔐 JWT Authentication
* 🏗️ NestJS (Node.js backend)
* 🧰 MongoDB for persistence
* 📦 Nx Monorepo for tooling and scaling
