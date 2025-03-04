# Hono.js & Prisma Backend Template

![Hono](https://img.shields.io/badge/Hono-3.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, type-safe, and production-ready backend template built with Hono.js and Prisma ORM. This template follows a domain-driven approach and best practices for building scalable and maintainable APIs.

## ✨ Features

- 🚀 **[Hono.js](https://hono.dev/)** - Ultrafast web framework for the edge
- 🔍 **[Prisma ORM](https://www.prisma.io/)** - Type-safe database access
- 📝 **[TypeScript](https://www.typescriptlang.org/)** - Static type checking
- 🧪 **[Vitest](https://vitest.dev/)** - Fast testing framework
- 📋 **[Zod](https://zod.dev/)** - Schema validation
- 📊 **[Pino](https://getpino.io/)** - Structured application logging
- 📏 **[ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)** - Code quality and formatting
- 🔨 **[Husky](https://typicode.github.io/husky/) & [lint-staged](https://github.com/okonet/lint-staged)** - Git hooks for code quality
- 🔐 **JWT Authentication** - Ready-to-use auth system
- 🚦 **Rate Limiting** - API protection
- 🗂️ **Module Aliases** - Clean import paths
- 📦 **Environment Management** - Using dotenv and validation
- 🐳 **Docker Support** - Containerization ready
- ⚡ **Hot Reload** - Fast development experience

## 🏗️ Architecture

This template follows a domain-driven design approach:

```
src/
├── modules/               # Domain modules
│   ├── auth/              # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.routes.ts
│   │   ├── auth.service.ts
│   │   └── auth.validator.ts
│   └── user/              # User module
│       └── user.repository.ts
├── middlewares/           # Middleware functions
├── utils/                 # Utility functions
├── config/                # Application configuration
├── app.ts                 # Application setup
├── index.ts               # Entry point
└── prisma.ts              # Prisma client
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, Yarn, or pnpm
- PostgreSQL (or any database supported by Prisma)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/hono-prisma-template.git
cd hono-prisma-template
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables:

```bash
cp .env.example .env
# Edit .env with your database connection and other settings
```

4. Set up the database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Start the development server:

```bash
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints

- **POST /api/v1/auth/register** - Register a new user

  - Request: `{ email: string, password: string, name?: string }`
  - Response: `{ success: true, message: string, data: { user: User, token: string } }`

- **POST /api/v1/auth/login** - Log in with existing credentials
  - Request: `{ email: string, password: string }`
  - Response: `{ success: true, message: string, data: { user: User, token: string } }`

### Health Check

- **GET /api/v1/health** - Check API status
  - Response: `{ status: "ok", timestamp: string }`

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio for database management

## 🔒 Environment Variables

```
# Application settings
NODE_ENV=development
PORT=3000
HOST=localhost
API_PREFIX=/api/v1

# Database settings
DATABASE_URL=postgresql://user:password@localhost:5432/mydb?schema=public

# JWT settings
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=604800

# Log settings
LOG_LEVEL=info

# Rate limit settings
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
```

## 🐳 Docker

This template comes with Docker configuration for easy containerization:

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📋 Best Practices

This template implements several best practices:

- **Domain-Driven Design**: Each feature is organized into its own module
- **Layered Architecture**: Clear separation of concerns between routes, controllers, services, and repositories
- **Error Handling**: Centralized error management with detailed feedback
- **Validation**: Input validation with Zod
- **Logging**: Structured logging with different levels
- **Security**: Rate limiting, secure headers, and JWT auth
- **Testing**: Unit and integration tests with high coverage

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using Hono.js and Prisma
