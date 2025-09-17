# Nifty Learning Platform

## Live Services

- **Web Application**: [https://nifty.alexcretu.com/](https://nifty.alexcretu.com/)
- **API & OpenAPI Documentation**: [https://nifty-api.alexcretu.com/api](https://nifty-api.alexcretu.com/api)

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

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

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
