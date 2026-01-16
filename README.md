# UnivStore

UnivStore is a full-stack project consisting of a NestJS backend and a Next.js frontend, integrated with Docker.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose

### Run with Docker

1. **Clone the repository**
2. **Setup environment**: Copy `.env.example` to `.env` in the root and subdirectories.
3. **Start services**:
   ```bash
   docker-compose up --build
   ```
   The application will be available at:
   - Frontend: [http://localhost:8080](http://localhost:8080)
   - API: [http://localhost:81](http://localhost:81)

## 📁 Project Structure

| Directory | Description |
|-----------|-------------|
| [`api/`](./api) | NestJS Backend |
| [`webapp/`](./webapp) | Next.js Frontend |
| [`docs/`](./docs) | Project Documentation |

## 📖 Documentation

- [Project Overview](./docs/overview.md)
- [Architecture & Tech Stack](./docs/architecture.md)
- [Setup & Development Guide](./docs/setup.md)

---
UnivStore
