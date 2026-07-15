import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import {
  getLocaleFromPathname,
  negotiateLocale,
  stripLocaleFromPathname,
} from "./lib/i18n";

const LOCALE_COOKIE = "awesome-locale";
const INTERNAL_LOCALE_TOKEN = randomUUID();
const MACHINE_ROUTE_PREFIXES = [
  "/api/",
  "/llms.txt",
  "/opengraph-image",
  "/manifest.webmanifest",
  "/robots.txt",
  "/sitemap.xml",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-icon.png",
] as const;

function buildPageCsp(nonce: string) {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https: data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

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
    const response = NextResponse.next();
    const csp = request.headers.get("content-security-policy");
    if (csp) response.headers.set("Content-Security-Policy", csp);
    return response;
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
  const nonce = randomUUID().replaceAll("-", "");
  const csp = buildPageCsp(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-awesome-locale", locale);
  requestHeaders.set("x-awesome-locale-token", INTERNAL_LOCALE_TOKEN);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  // Route IDs may legitimately end in `.css`, `.design`, `.hig`, etc.; only
  // exclude known framework/static roots rather than treating every suffix as a file.
  matcher: [
    "/((?!_next/|api/|favicon.ico$|icon.svg$|icon-192.png$|icon-512.png$|icon-maskable-512.png$|apple-icon.png$|llms.txt$|robots.txt$|sitemap.xml$|manifest.webmanifest$|opengraph-image$).*)",
  ],
};
