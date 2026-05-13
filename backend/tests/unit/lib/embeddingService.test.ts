import { describe, it, expect } from "bun:test";
import { embeddingService } from "../../../lib/embeddingService";

describe("getEmbeddingText", () => {
  it("should format all fields correctly", () => {
    const snippet = {
      id: "1",
      title: "Debounce",
      language: "TypeScript",
      code: "const fn = () => {}",
      summary: "A debounce utility",
    };

    expect(embeddingService.getEmbeddingText(snippet)).toBe(
      "Title: Debounce\nLanguage: TypeScript\nSummary: A debounce utility\nCode:\nconst fn = () => {}",
    );
  });
});
