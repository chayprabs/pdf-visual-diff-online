import { describe, it, expect } from "vitest";
import type { DiffResult } from "./index.js";

describe("shared-types", () => {
  it("exports DiffResult shape", () => {
    const r: DiffResult = {
      pages: [],
      metadata: {},
      signatures: {
        baseline: { present: false },
        candidate: { present: false },
      },
      summary: "No differences.",
    };
    expect(r.summary).toBe("No differences.");
  });
});
