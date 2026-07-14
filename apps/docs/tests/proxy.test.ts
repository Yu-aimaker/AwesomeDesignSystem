import { describe, expect, test } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";

describe("locale proxy trust boundary", () => {
  test("a client-supplied internal locale header cannot bypass negotiation", () => {
    const request = new NextRequest("https://awesome.test/rules", {
      headers: { "accept-language": "ja", "x-awesome-locale": "en" },
    });

    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://awesome.test/ja/rules");
  });

  test("a client cannot guess the rewrite token to bypass negotiation", () => {
    const request = new NextRequest("https://awesome.test/rules", {
      headers: {
        "accept-language": "ja",
        "x-awesome-locale": "en",
        "x-awesome-locale-token": "client-controlled",
      },
    });

    const response = proxy(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://awesome.test/ja/rules");
  });

  test("a localized route overwrites a forged internal locale header", () => {
    const request = new NextRequest("https://awesome.test/ja/rules", {
      headers: { "x-awesome-locale": "en" },
    });

    const response = proxy(request);
    expect(response.headers.get("x-middleware-rewrite")).toBe("https://awesome.test/rules");
    expect(response.headers.get("x-middleware-override-headers")).toContain("x-awesome-locale");
    expect(response.headers.get("x-middleware-request-x-awesome-locale")).toBe("ja");
  });
});
