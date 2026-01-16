# Architecture & Tech Stack

UnivStore follows a modern client-server architecture, containerized with Docker to ensure consistency across environments.

## 🛠️ The Tech Stack

### Backend ([`api/`](file:///c:/xampp/htdocs/tienda/api))
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Passport.js](https://www.passportjs.org/) with JWT (JSON Web Tokens)
- **Validation**: [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer)
- **Slug Generation**: [slugify](https://www.npmjs.com/package/slugify)

### Frontend ([`webapp/`](file:///c:/xampp/htdocs/tienda/webapp))
- **Framework**: [Next.js](https://nextjs.org/) 15+ (App Router)
- **Library**: [React](https://reactjs.org/) 19+
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Infrastructure
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- **Proxy/Web Server**: Docker serves the applications, with easy potential for Nginx integration.
- **Environment Management**: Centralized `.env` configuration.

## 📁 Key Directories

### API (`/api/src`)
- `modules/`: Feature-based modules (User, Product, Cart, etc.).
- `common/`: Shared decorators, guards, and interceptors.
- `config/`: Configuration loaders.

### Webapp (`/webapp/app`)
- `(public)/`: Routes accessible to everyone.
- `(protected)/`: Routes requiring authentication (Wishlist, etc.).
- `(admin)/`: Routes for administrative management.
- `components/`: UI components organized by feature.
- `stores/`: Zustand store definitions.

## 🔄 Data Flow

1. User interacts with the **Next.js Webapp**.
2. Webapp sends requests to the **NestJS API** via Axios.
3. API validates requests and interacts with **MongoDB**.
4. API returns JSON responses back to the Webapp.
5. Webapp updates UI state using **Zustand** or React state.
