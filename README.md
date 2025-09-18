# Nifty Learning Platform - Team Learning Dashboard

- **Web Application**: [https://nifty.alexcretu.com/](https://nifty.alexcretu.com/)
- **API & OpenAPI Documentation**: [https://nifty-api.alexcretu.com/api](https://nifty-api.alexcretu.com/api)

## Project Overview

This dashboard that provides:

- **Team Overview**: Statistics on team learning progress
- **Member Management**: Detailed view of individual user progress
- **Course Tracking**: Monitor course completions, time spent, and due dates
- **Analytics Dashboard**: Visual representations of learning metrics
- **Search & Filter**: Advanced search with full-text search and overdue filtering

## Technologies Used

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Express** - Fast, unopinionated web framework
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Biome** - Linting and formatting
- **Husky** - Git hooks for code quality
- **Turborepo** - Optimized monorepo build system

## Architectural Decisions

> **TL;DR**: I really f\*\*\*ing love TypeScript

#### Backend Architecture

- **Bun Runtime**: Chosen for performance, built-in TypeScript support, and integrated utilities (password hashing, testing)
- **Express + ORPC**: Type-safe API layer with automatic OpenAPI documentation generation
- **PostgreSQL**: Relational database with a great search capabilities using full-text search
- **Drizzle ORM**: TypeScript-first ORM providing type safety at the database layer

#### Frontend Architecture

- **React + TanStack Router**: File-based routing with full type safety
- **TanStack Query**: Powerful data fetching library with automatic caching and refetching
- **Tailwind CSS + shadcn/ui**: Rapid UI development with consistent design system
- **Vite**: Fast HMR and optimized production builds

### Design Patterns

- **Monorepo Structure**: Shared types and utilities between frontend and backend
- **Repository Pattern**: Clean separation of data access logic
- **Optimistic UI Updates**: Better user experience with immediate feedback
- **Full-Text Search**: PostgreSQL's built-in Full Text Search for efficient and powerful search capabilities
- **Biome + Husky**: Enforce code quality and consistency with linting and pre-commit hooks

### Trade-offs Made

1. **Build vs Buy Decision**: Chose to implement core functionality from scratch rather than relying on third-party libraries, demonstrating deeper technical understanding
2. **Complexity vs Simplicity**: Chose a full-featured stack over minimal setup for better DX and maintainability
3. **Type Safety vs Flexibility**: Prioritized type safety throughout the stack
4. **Authentication**: Implemented basic JWT auth instead of using a library like BetterAuth for simplicity.

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun db:push
```

4. Seed the database with realistic test data:

```bash
bun db:seed
```

This will populate your database with:

- 100 users with realistic names and emails
- 15 courses across various tech topics
- Progress records linking users to courses with completion data

Then, run the development server:

```bash
bun dev
```

## Access the Applications

- **Web Application**: [http://localhost:3001](http://localhost:3001)
- **API Documentation**: [http://localhost:3000/api](http://localhost:3000/api)
- **Database Studio**: Run `bun db:studio` to explore data

## Testing

The project include some unit tests using Bun's built-in test runner.

## Project Structure

```
nifty-learning-assessment/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   └── server/      # Backend API (Express, ORPC)
```

## Available Scripts

### Root Directory Commands

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `bun dev`         | Start all applications in development mode |
| `bun build`       | Build all applications                     |
| `bun dev:web`     | Start only the web application             |
| `bun dev:server`  | Start only the server                      |
| `bun check-types` | Check TypeScript types across all apps     |
| `bun db:push`     | Push schema changes to database            |
| `bun db:studio`   | Open database studio UI                    |
| `bun check`       | Run Biome formatting and linting           |

### Server-specific Commands

Run these commands from the `apps/server` directory:

| Command       | Description                         |
| ------------- | ----------------------------------- |
| `bun db:seed` | Seed the database with initial data |
