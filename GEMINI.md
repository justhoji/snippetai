# AI Powered Code Vault: Project Instructions

This repository contains a full-stack AI-powered code snippet manager.

## Tech Stack

- **Runtime:** Bun
- **Backend:** Express.js with TypeScript
- **Frontend:** React (Vite) with TypeScript
- **Styling:** Tailwind CSS v4 (requires `@tailwindcss/vite` plugin)
- **Database:** PostgreSQL with Prisma ORM
- **AI:** OpenAI API

## Workflow Mandates
- **Documentation:** ALWAYS use Context7 tools (`resolve-library-id` and `query-docs`) when researching libraries, frameworks, or configuration. This ensures the use of up-to-date documentation and best practices.
- **Development:** Use Bun as the primary package manager and runtime.
- **Backend:** Run with `bun --watch index.ts` during development.
- **Frontend:** Run with `bun run dev` (Vite).
- **Formatting:** Use Prettier for code formatting. Run `bun run format` from the root to format the entire project.


## Project Structure

- `/backend`: Express server and Prisma schema.
- `/frontend`: React client with Tailwind v4.

## Style & Conventions

- Prefer functional components and hooks in React.
- Use Tailwind utility classes for all styling.
- Ensure all API endpoints are validated with Zod.
