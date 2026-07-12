import { NextRequest, NextResponse } from "next/server";
import { getLocaleFromPathname, negotiateLocale, stripLocaleFromPathname } from "./lib/i18n";

const LOCALE_COOKIE = "awesome-locale";

export function proxy(request: NextRequest) {
  if (request.headers.get("x-awesome-locale")) {
    return NextResponse.next();
  }
  const { pathname } = request.nextUrl;
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    const selected = negotiateLocale(request.cookies.get(LOCALE_COOKIE)?.value, request.headers.get("accept-language"));
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${selected}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(redirectUrl);
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = stripLocaleFromPathname(pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-awesome-locale", locale);
  const response = NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  // Route IDs may legitimately end in `.css`, `.design`, `.hig`, etc.; only
  // exclude known framework/static roots rather than treating every suffix as a file.
  matcher: ["/((?!_next/|favicon.ico$|icon.svg$|robots.txt$|sitemap.xml$).*)"],
};
