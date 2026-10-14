import { type NextRequest, NextResponse } from "next/server";
import { hasLocale } from "next-intl";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { hasSessionCookie } from "./lib/session-cookie";

const handleLocaleRouting = createMiddleware(routing);

const readLocalePath = (pathname: string) => {
  const [, firstSegment = "", ...restSegments] = pathname.split("/");
  const localePath = hasLocale(routing.locales, firstSegment)
    ? { prefix: `/${firstSegment}`, path: `/${restSegments.join("/")}` }
    : { prefix: "", path: pathname };

  return localePath;
};

export default function proxy(request: NextRequest) {
  const { prefix, path } = readLocalePath(request.nextUrl.pathname);
  if (path === "/" && !hasSessionCookie(request.cookies))
    return NextResponse.redirect(new URL(`${prefix}/login`, request.url));

  return handleLocaleRouting(request);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
