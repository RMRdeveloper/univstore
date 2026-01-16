# Setup & Development Guide

This guide covers how to set up UnivStore for development and production.

## 🐳 Docker Setup (Recommended)

Run the entire stack without installing dependencies locally.

### Standard Setup
```bash
docker-compose up --build
```
This starts:
- `mongodb`: Database (Port 27017)
- `api`: NestJS Backend (Port 4000)
- `webapp`: Next.js Frontend (Port 3000)

### Production Setup
```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

---

## 💻 Local Development

If you prefer to run services manually for faster hot-reloading:

### 1. Prerequisites
- Node.js 20+
- MongoDB running locally or in a container.

### 2. Backend (API)
1. Navigate to `api/`.
2. Install dependencies: `npm install`.
3. Configure `.env` (copy from `.env.example`).
4. Start dev server: `npm run start:dev`.

### 3. Frontend (Webapp)
1. Navigate to `webapp/`.
2. Install dependencies: `npm install`.
3. Configure `.env` (copy from `.env.example`).
4. Start dev server: `npm run dev`.

---

## 🔑 Environment Variables

### Root `.env`
- `MONGO_INITDB_ROOT_USERNAME`: DB admin user.
- `MONGO_INITDB_ROOT_PASSWORD`: DB admin password.

### API `.env`
- `DATABASE_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT generation.
- `PORT`: API port (default 4000).

### Webapp `.env`
- `NEXT_PUBLIC_API_URL`: URL of the backend API (default http://localhost:4000).

---

## 🧪 Testing

### Backend
- Run unit tests: `npm run test` (inside `api/`).
- Run E2E tests: `npm run test:e2e` (inside `api/`).

### Frontend
- Linting: `npm run lint` (inside `webapp/`).
