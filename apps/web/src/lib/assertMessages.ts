import type { AssertionResult } from "@pdf-diff/shared-types";

const REASON_LABELS: Record<NonNullable<AssertionResult["failureReason"]>, string> = {
  pixel_threshold: "Pixel diff exceeded the threshold.",
  structural: "Structural or text changes detected (not pixel-only).",
  structural_and_pixel: "Both structural changes and pixel diff exceeded threshold.",
  page_count_mismatch: "Page count differs between baseline and candidate.",
};

export function assertFailureDetail(assertion: AssertionResult): string | null {
  if (assertion.pass || !assertion.failureReason) return null;
  return REASON_LABELS[assertion.failureReason] ?? assertion.failureReason;
}
