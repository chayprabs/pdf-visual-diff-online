import { test, expect } from "@playwright/test";

test("homepage has compare workflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "PdfDiff" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Compare PDFs" })).toBeVisible();
  await expect(page.getByText("Baseline PDF")).toBeVisible();
  await expect(page.getByText("Candidate PDF")).toBeVisible();
});

test("privacy and terms pages load", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /Privacy Policy/i })).toBeVisible();
  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: /Terms/i })).toBeVisible();
});

test("seo landing routes load", async ({ page }) => {
  for (const path of ["/pdf-compare", "/pdf-visual-diff", "/pdf-text-diff"]) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Compare PDFs" })).toBeVisible();
  }
});
