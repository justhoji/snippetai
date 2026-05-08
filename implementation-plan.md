# Implementation Plan: AI Powered Code Vault

This plan breaks the project into logical phases to move from setup to a fully functional AI-powered application.

## Phase 1: Foundation & Project Setup

- [x] **1.1 Workspace Initialization:**
  - Create a monorepo structure (or separate `/backend` and `/frontend` folders).
  - Initialize `git` repository.
- [x] **1.2 Backend Setup:**
  - Initialize Node.js with TypeScript.
  - Install dependencies (Express, Prisma, Zod, etc.).
- [x] **1.3 Database Modeling:**
  - Define Prisma schema (User, Snippet, Folder, Tag).
  - Run initial migrations and verify database connection.
- [x] **1.4 Frontend Setup:**
  - Initialize React with Vite and TypeScript.
  - Install Tailwind CSS and Lucide React.

## Phase 2: Core Snippet Management (CRUD)

- [x] **2.1 Backend API - CRUD:**
  - Implement routes for creating, reading, updating, and deleting snippets.
  - Add basic validation using Zod.
- [x] **2.2 Frontend UI - Basic Layout:**
  - Build a sidebar for navigation (Collections/Folders).
  - Build a snippet list view and a detailed view.
- [x] **2.3 Snippet Editor:**
  - Integrate a code editor component (e.g., CodeMirror or Monaco).
  - Implement "Create" and "Edit" forms on the frontend.
- [x] **2.4 Syntax Highlighting:**
  - Implement Shiki for high-quality code rendering in the view mode.

## Phase 3: Search & Organization

- [ ] **3.1 Search Functionality:**
  - Implement a high-performance search bar (keyword-based `ILIKE` search).
  - Add filtering by language and tags.
- [ ] **3.2 Collections & Folders:**
  - Implement logic to group snippets into folders.
  - Update UI to allow dragging/moving snippets between collections.
- [ ] **3.3 Keyboard Shortcuts:**
  - Add global shortcuts (e.g., `Cmd+K` for search, `Cmd+N` for new snippet).

## Phase 4: AI Integration (The "Brain")

- [ ] **4.1 AI Provider Setup:**
  - Integrate OpenAI API (or LangChain).
  - Implement utility for generating summaries and auto-tags.
- [ ] **4.2 Smart Auto-Categorization:**
  - When a snippet is saved, trigger an AI call to detect language and suggest tags.
- [ ] **4.3 AI Explainer:**
  - Add an "Explain" button that displays a generated summary for a snippet.
- [ ] **4.4 Semantic Search (Optional "Level Up"):**
  - Implement vector embedding generation for new snippets.
  - Create a "Semantic Search" toggle in the UI that queries via `pgvector`.

## Phase 5: Polish & Deployment

- [ ] **5.1 UI/UX Refinement:**
  - Add loading states, transitions, and toast notifications.
  - Ensure fully responsive design.
- [ ] **5.2 Security Scan (Basic):**
  - Implement a simple regex/AI check for API keys or secrets before saving.
- [ ] **5.3 Data Portability:**
  - Add a feature to export the vault as a `.zip` of Markdown files.
- [ ] **5.4 Documentation:**
  - Finalize `README.md` with setup instructions for other developers.
