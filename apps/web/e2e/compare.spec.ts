import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("compare workflow", () => {
  test("sample compare shows results", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Sample: Contract/i }).click();
    await expect(page.getByText("contract-v1.pdf")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("contract-v2.pdf")).toBeVisible();
    await page.getByRole("button", { name: "Compare PDFs" }).click();
    await expect(page.getByText(/page\(s\)|No visual|difference/i)).toBeVisible({
      timeout: 120_000,
    });
    await expect(page.getByRole("button", { name: "Page 1" })).toBeVisible();
  });
});
