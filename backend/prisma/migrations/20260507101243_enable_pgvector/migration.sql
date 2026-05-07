-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "Snippet" ADD COLUMN     "embedding" vector(1536);
