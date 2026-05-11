# 🚀 Snippet AI: Your Intelligent Code Vault

Snippet AI is a full-stack, AI-powered code snippet manager designed for modern developers. It allows you to store, organize, and intelligently search for code snippets using vector embeddings and natural language processing.

## ✨ Features

- **AI-Powered Search:** Find snippets using natural language queries, powered by OpenAI embeddings.
- **Smart Tagging:** Automatically categorize and tag snippets for better organization.
- **Multi-Language Support:** Syntax highlighting and support for a wide range of programming languages.
- **Unified Interface:** A clean, modern React frontend integrated with a robust Express/Bun backend.
- **Deployment Ready:** Optimized for Railway and Docker with a unified service architecture.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with Vite
- **Styling:** Tailwind CSS v4
- **State Management:** TanStack Query (React Query)
- **Editor:** CodeMirror with Shiki highlighting

### Backend
- **Runtime:** Bun
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (with `pgvector` for AI search)
- **AI:** OpenAI API

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (Primary runtime and package manager)
- [Docker](https://www.docker.com/) (For production-like local runs)
- PostgreSQL (with `pgvector` extension enabled)
- OpenAI API Key

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd snippet-ai
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Set up Environment Variables:**
   Create `.env` files in both `/backend` and `/frontend` based on the provided `.env.example` files.

4. **Run the application:**
   - **Backend:** `cd backend && bun dev`
   - **Frontend:** `cd frontend && bun run dev`

### Production Run (Docker)

You can run the entire stack as a single unified service using Docker:

1. **Build the image:**
   ```bash
   docker build -t snippet-ai .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3001:3000 \
     --env-file backend/.env \
     -e DATABASE_URL="postgresql://user:pass@host.docker.internal:5432/db" \
     snippet-ai
   ```
   *Note: Use `host.docker.internal` to connect to a database running on your host machine.*

## 🚢 Deployment (Railway)

This project is optimized for [Railway](https://railway.app/):

1. Connect your GitHub repository to Railway.
2. Railway will automatically detect the `Dockerfile` and `railway.json`.
3. Ensure you provide the necessary environment variables (`DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`) in the Railway dashboard.
4. The backend will automatically handle serving the static frontend files and running Prisma migrations.

## 📄 License

This project is licensed under the MIT License.
