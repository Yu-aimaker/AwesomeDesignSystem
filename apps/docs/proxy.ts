import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import {
  getLocaleFromPathname,
  negotiateLocale,
  stripLocaleFromPathname,
} from "./lib/i18n";

const LOCALE_COOKIE = "awesome-locale";
const INTERNAL_LOCALE_TOKEN = randomUUID();
const MACHINE_ROUTE_PREFIXES = ["/api/", "/llms.txt"] as const;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    MACHINE_ROUTE_PREFIXES.some(
      (route) => pathname === route || pathname.startsWith(route),
    )
  ) {
    return NextResponse.next();
  }
  if (
    request.headers.get("x-awesome-locale-token") === INTERNAL_LOCALE_TOKEN &&
    getLocaleFromPathname(request.nextUrl.pathname) === null
  ) {
    return NextResponse.next();
  }
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    const selected = negotiateLocale(
      request.cookies.get(LOCALE_COOKIE)?.value,
      request.headers.get("accept-language"),
    );
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${selected}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(redirectUrl);
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vary", "Cookie, Accept-Language");
    return response;
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = stripLocaleFromPathname(pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-awesome-locale", locale);
  requestHeaders.set("x-awesome-locale-token", INTERNAL_LOCALE_TOKEN);
  const response = NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  // Route IDs may legitimately end in `.css`, `.design`, `.hig`, etc.; only
  // exclude known framework/static roots rather than treating every suffix as a file.
  matcher: [
    "/((?!_next/|api/|favicon.ico$|icon.svg$|llms.txt$|robots.txt$|sitemap.xml$).*)",
  ],
};
