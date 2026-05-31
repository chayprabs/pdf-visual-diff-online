import { test, expect } from "@playwright/test";

test.describe("compare workflow", () => {
  test("sample compare shows results", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Sample: Contract/i }).click();
    await page.getByRole("button", { name: "Compare PDFs" }).click();
    await expect(page.getByText(/page\(s\)|No visual/i)).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole("button", { name: "Page 1" })).toBeVisible();
  });
});
