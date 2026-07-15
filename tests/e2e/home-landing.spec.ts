import { expect, test } from "@playwright/test";

test("home provenance instrument switches among real evidence chains", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en", { waitUntil: "domcontentloaded" });

  const instrument = page.getByRole("complementary", { name: "Live provenance instrument" });
  const tokenIntent = instrument.getByRole("button", { name: /Scale UI through semantic design tokens/ });
  await tokenIntent.focus();
  await page.keyboard.press("Space");

  await expect(tokenIntent).toHaveAttribute("aria-pressed", "true");
  await expect(instrument.getByRole("link", { name: /rule\.foundations\.semantic-tokens/ })).toHaveAttribute(
    "href",
    "/en/rules/rule.foundations.semantic-tokens",
  );
  await expect(instrument.locator(".evidence-instrument__trace li").nth(2).getByRole("link")).toHaveAttribute(
    "href",
    /\/en\/artifacts\//,
  );
});
