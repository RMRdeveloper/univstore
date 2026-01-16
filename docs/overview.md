# Project Overview: UnivStore

UnivStore is a full-stack application with a NestJS API and a Next.js Webapp.

## 🏗️ Components

### 1. Backend ([`api/`](../api))
A NestJS application providing a REST API. It includes the following modules:
- Auth
- Users
- Products
- Categories
- Cart
- Wishlist
- Search
- Upload

### 2. Frontend ([`webapp/`](../webapp))
A Next.js application that consumes the API. It is organized using the App Router and includes:
- Protected routes (Wishlist, etc.)
- Public routes
- Admin interface
- Feature-based components

## 🛠️ Data Management
- **Database**: MongoDB (via Mongoose)
- **State**: Zustand (frontend)
- **Auth**: JWT (JSON Web Tokens)
