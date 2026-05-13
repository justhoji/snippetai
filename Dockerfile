# Stage 1: Base image
FROM oven/bun:1 AS base
WORKDIR /app

# Stage 2: Install dependencies
FROM base AS install
# Copy root package.json and workspace configurations
COPY package.json bun.lock ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
# Install all dependencies (dev + prod) for build
RUN bun install

# Stage 3: Build frontend and generate Prisma client
FROM install AS build
COPY . .
# Build frontend
ENV VITE_API_URL=/api
RUN cd frontend && bun run build
# Generate Prisma client
RUN cd backend && bunx --bun prisma generate

# Stage 4: Production runner
FROM base AS release
ENV NODE_ENV=production

# Copy necessary files from build stage
COPY --from=build /app/package.json /app/bun.lock ./
COPY --from=build /app/backend/package.json ./backend/
COPY --from=build /app/frontend/package.json ./frontend/

# Copy built frontend assets
COPY --from=build /app/frontend/dist ./frontend/dist

# Copy backend source code and generated Prisma files
COPY --from=build /app/backend/ ./backend/

# Install only production dependencies
RUN bun install --production

# Expose port (Railway dynamically sets PORT, defaults to 3001 here)
ENV PORT=3001
EXPOSE 3001

# Start command
WORKDIR /app/backend
CMD bunx prisma migrate deploy && bun start
