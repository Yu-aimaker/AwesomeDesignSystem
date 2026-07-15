import { describe, expect, test } from "vitest";
import { parseSidebarState, SIDEBAR_COOKIE } from "../lib/sidebar-state";

describe("desktop sidebar persistence", () => {
  test("accepts only the explicit collapsed state", () => {
    expect(parseSidebarState("collapsed")).toBe("collapsed");
    expect(parseSidebarState("expanded")).toBe("expanded");
    expect(parseSidebarState("unexpected")).toBe("expanded");
    expect(parseSidebarState(undefined)).toBe("expanded");
  });

  test("uses a stable product-scoped cookie name", () => {
    expect(SIDEBAR_COOKIE).toBe("awesome-sidebar");
  });
});
