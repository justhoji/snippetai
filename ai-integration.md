# AI Integration Plan: Code Vault Intelligence

This document outlines the strategy for transforming the Code Vault into a truly AI-powered snippet manager.

## Phase 4: Generative AI (Enrichment & Understanding)

Focuses on using LLMs (OpenAI) to enhance snippet quality and developer comprehension.

### 1. AI Code Explainer (View Mode)

- **Feature:** A "Magic Wand" icon in `SnippetView`.
- **Function:** Generates a detailed, line-by-line explanation of the code.
- **Value:** Helps developers understand complex or old snippets quickly.

### 2. Smart Auto-Tagging & Summarization (Form Mode)

- **Feature:** "Suggest Meta" button in `SnippetForm`.
- **Function:** Analyzes code to automatically generate a concise summary and relevant tags.
- **Value:** Automates organization and ensures consistent metadata.

### 3. Code Optimization Suggestions

- **Feature:** "Optimize" action for existing snippets.
- **Function:** AI proposes modernized or more performant versions of the code.
- **Value:** Keeps the vault's code quality high over time.

### 4. Automatic Language Detection

- **Feature:** Real-time detection in the editor.
- **Function:** Automatically sets the language dropdown based on pasted code structure.

---

## Phase 5: Semantic Intelligence (Knowledge Retrieval)

Focuses on intent-based discovery using Vector Embeddings and `pgvector`.

### 1. Semantic Search (Intent-based)

- **Feature:** Advanced search bar capability.
- **Function:** Matches queries based on functional intent (e.g., "handle async errors") rather than just keywords.
- **Implementation:** Convert snippets to embeddings and store in PostgreSQL using `pgvector`.

### 2. Related Snippets Discovery

- **Feature:** "Similar Snippets" sidebar in View mode.
- **Function:** Uses vector similarity to show functionally related code.

---

## Implementation Roadmap

### Step 1: Backend Infrastructure

- Install `openai` SDK.
- Configure secure API key management in `.env`.
- Create `aiService.ts` for centralized prompt management.

### Step 2: Generative Endpoints

- `POST /api/ai/explain`: Code -> Markdown Explanation.
- `POST /api/ai/suggest-meta`: Code -> { summary: string, tags: string[] }.

### Step 3: Frontend Integration

- Add AI action buttons with polished loading states.
- Integrate "Suggest" logic into `useSnippetForm`.
- Add Explanation drawer/modal to `SnippetView`.

### Step 4: Vectorization (Phase 5)

- Set up `pgvector` extension in Prisma.
- Implement background embedding generation on snippet save.
- Replace/Enhance current search logic with vector similarity.
