import { expect, test } from "@playwright/test";

test("native RadioGroup and Accordion contracts work from the keyboard", async ({ page }) => {
  await page.goto("/en/components/radio-group", { waitUntil: "domcontentloaded" });
  const small = page.getByRole("radio", { name: "S" });
  await small.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: "M" })).toBeChecked();

  await page.goto("/en/components/accordion", { waitUntil: "domcontentloaded" });
  const summary = page.locator("summary", { hasText: "Details" });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(summary.locator("xpath=..")).toHaveAttribute("open", "");
});

test("tooltip has one trigger and supports keyboard dismissal", async ({ page }) => {
  await page.goto("/ja/components/tooltip", { waitUntil: "networkidle" });
  const trigger = page.getByRole("button", { name: "ホバー・フォーカス" });
  await expect(trigger).toHaveCount(1);
  await trigger.focus();
  await page.keyboard.press("Tab");
  await expect(trigger).not.toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("tooltip")).toHaveText("詳しい情報");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
});

test("component API table is a localized keyboard-scrollable region", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/ja/components/alert-dialog", { waitUntil: "domcontentloaded" });
  const region = page.getByRole("region", { name: "AlertDialogの公開API" });
  await region.focus();
  await expect(region).toBeFocused();
  await expect(region).toHaveCSS("overflow-x", "auto");
});

test("component live recovery actions expose observable localized feedback", async ({ page }) => {
  await page.goto("/ja/components/error-state", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "再試行" }).click();
  await expect(page.getByRole("status")).toHaveText("再試行しました。");

  await page.goto("/ja/components/dropdown-menu", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "メニュー" }).click();
  await page.getByRole("menuitem", { name: "編集" }).click();
  await expect(page.getByRole("status")).toHaveText("編集を選択しました。");
});

test("Dialog traps focus and restores its trigger after Escape", async ({ page }) => {
  await page.goto("/en/components/dialog", { waitUntil: "networkidle" });
  const trigger = page.getByRole("button", { name: "Open dialog" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Dialog" });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole("button", { name: "Close" });
  await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("DropdownMenu supports arrows, Home, End, Escape, and focus restoration", async ({ page }) => {
  await page.goto("/en/components/dropdown-menu", { waitUntil: "networkidle" });
  const trigger = page.getByRole("button", { name: "Menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const edit = page.getByRole("menuitem", { name: "Edit" });
  const share = page.getByRole("menuitem", { name: "Share" });
  await expect(edit).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(share).toBeFocused();
  await page.keyboard.press("Home");
  await expect(edit).toBeFocused();
  await page.keyboard.press("End");
  await expect(share).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("Tabs supports both arrows plus Home and End with automatic activation", async ({ page }) => {
  await page.goto("/en/components/tabs", { waitUntil: "networkidle" });
  const first = page.getByRole("tab", { name: "One" });
  const second = page.getByRole("tab", { name: "Two" });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(first).toBeFocused();
  await page.keyboard.press("End");
  await expect(second).toBeFocused();
  await page.keyboard.press("Home");
  await expect(first).toBeFocused();
});

test("Popover dismisses from the keyboard and preserves focus", async ({ page }) => {
  await page.goto("/en/components/popover", { waitUntil: "networkidle" });
  const popoverTrigger = page.getByRole("button", { name: "Open popover" });
  await popoverTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Open popover" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Open popover" })).toBeHidden();
  await expect(popoverTrigger).toBeFocused();

});

test("native Select changes selection from the keyboard", async ({ page }) => {
  await page.goto("/en/components/select", { waitUntil: "networkidle" });
  const select = page.getByRole("combobox", { name: "Role" });
  await select.focus();
  await page.keyboard.press("e");
  await expect(select).toHaveValue("Editor");
});
