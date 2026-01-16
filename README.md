# UnivStore

UnivStore is a modern e-commerce platform built with a microservices-inspired architecture. It consists of a robust NestJS backend and a performant Next.js frontend, all orchestrated with Docker.

## 🚀 Quick Start

The easiest way to get started is using Docker Compose.

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- MongoDB (optional, if not using Docker)

### Run with Docker

1. **Clone the repository**
2. **Environment Variables**: Copy `.env.example` to `.env` in the root and in the `api` and `webapp` directories.
3. **Start the services**:
   ```bash
   docker-compose up --build
   ```
   The application will be available at:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:4000](http://localhost:4000)

## 📁 Project Structure

| Directory | Description |
|-----------|-------------|
| [`api/`](file:///c:/xampp/htdocs/tienda/api) | NestJS Backend (REST API, MongoDB, JWT) |
| [`webapp/`](file:///c:/xampp/htdocs/tienda/webapp) | Next.js Frontend (React, Tailwind CSS, Zustand) |
| [`docs/`](file:///c:/xampp/htdocs/tienda/docs) | Project Documentation |

## 📖 Documentation

For more detailed information, check the documentation in the `docs` folder:

- [Project Overview](file:///c:/xampp/htdocs/tienda/docs/overview.md)
- [Architecture & Tech Stack](file:///c:/xampp/htdocs/tienda/docs/architecture.md)
- [Setup & Development Guide](file:///c:/xampp/htdocs/tienda/docs/setup.md)

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [Zustand](https://zustand-demo.pmnd.rs/)
- **Backend**: [NestJS](https://nestjs.com/), [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Infrastructure**: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/)

---
Created with ❤️ by the UnivStore Team.
