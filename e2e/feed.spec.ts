import { test, expect } from "@playwright/test";

test.describe("Feed E2E", () => {
  test("home loads and shows vertical video feed", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("feed", { name: /vertical video feed/i })).toBeVisible({
      timeout: 15_000,
    });
  });

  test("feed shows video cards when loaded", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("feed", { name: /vertical video feed/i })).toBeVisible({
      timeout: 15_000,
    });
    const cards = page.locator("[data-video-id]");
    await expect(cards.first()).toBeVisible({ timeout: 10_000 });
    await expect(cards).toHaveCount(2, { timeout: 10_000 });
  });

  test("unmute button toggles and persists across scroll", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("feed", { name: /vertical video feed/i })).toBeVisible({
      timeout: 15_000,
    });
    const unmute = page.getByRole("button", { name: /unmute/i }).first();
    await unmute.click();
    await expect(page.getByRole("button", { name: /mute/i }).first()).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("button", { name: /mute/i }).first()).toBeVisible();
  });

  test("arrow down scrolls to next video", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("feed", { name: /vertical video feed/i })).toBeVisible({
      timeout: 15_000,
    });
    await page.keyboard.press("ArrowDown");
    await expect(page.locator('[data-video-id="2"]')).toBeVisible({ timeout: 3000 });
  });
});
