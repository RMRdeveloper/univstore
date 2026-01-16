# Architecture & Tech Stack

This project uses a containerized architecture with Docker.

## 🛠️ Technologies

### Backend ([`api/`](file:///c:/xampp/htdocs/tienda/api))
- **NestJS** (v11.0.1)
- **Mongoose** (v9.1.3)
- **Passport** (JWT & Local)
- **TypeScript** (v5.7.3)

### Frontend ([`webapp/`](file:///c:/xampp/htdocs/tienda/webapp))
- **Next.js** (v16.1.2)
- **React** (v19.2.3)
- **Tailwind CSS** (v4.x)
- **Zustand** (v5.0.10)
- **Axios** (v1.13.2)

### Infrastructure
- **Docker** & **Docker Compose**
- **MongoDB** (v8.0)

## 📁 Key Directories

### API (`/api/src`)
- `modules/`: Feature modules.
- `config/`: Configuration (database, jwt, storage).
- `common/`: Shared logic.

### Webapp (`/webapp`)
- `app/`: Next.js App Router (Auth, Admin, Protected, Public).
- `components/`: UI components.
- `lib/`: Utilities and API configuration.
- `stores/`: Zustand stores.
