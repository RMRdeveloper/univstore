# Setup & Development Guide

## 🐳 Docker Setup

### Run services
```bash
docker-compose up --build
```
- **Webapp**: [http://localhost:8080](http://localhost:8080)
- **API**: [http://localhost:81](http://localhost:81)
- **MongoDB**: Port 27017

---

## 💻 Local Development

### API (`api/`)
1. `npm install`
2. Configure `.env` (Required: `MONGODB_URI`, `JWT_SECRET`, `PORT`)
3. `npm run start:dev`

### Webapp (`webapp/`)
1. `npm install`
2. Configure `.env` (Required: `NEXT_PUBLIC_API_URL`)
3. `npm run dev`

---

## 🔑 Key Environment Variables

- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret for JWT.
- `PORT`: Server port.
- `NEXT_PUBLIC_API_URL`: Backend URL for the frontend.
