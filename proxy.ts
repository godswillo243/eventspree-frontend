import { NextRequest, NextResponse } from "next/server";
import type { Cookie } from "set-cookie-parser";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { safeRedirect } from "@/lib/auth/redirect";
import { parseAuthCookies } from "@/lib/auth/cookies";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  API_URL,
  cookieBase,
} from "@/lib/auth/constants";

const inSection = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(base + "/");

// Pages a signed-in user has no reason to see
const GUEST_ONLY = [
  "/auth/signin",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
];

// Reachable without a session (besides /auth/*), e.g. "/terms", "/privacy"
// Reachable without a session (besides /auth/*)
const PUBLIC_EXACT = ["/"];
const PUBLIC_SECTIONS: string[] = ["/terms", "/about", "/browse"]; // e.g. "/terms", "/pricing", "/blog"

const isPublic = (pathname: string) =>
  PUBLIC_EXACT.includes(pathname) ||
  PUBLIC_SECTIONS.some((s) => inSection(pathname, s));

type RefreshResult =
  | { ok: true; cookies: Cookie[] }
  | { ok: false; invalid: boolean }; // invalid = API rejected the session (vs. a transient error)

async function refreshSession(rt: string): Promise<RefreshResult> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { Cookie: `${REFRESH_COOKIE}=${rt}` },
      signal: AbortSignal.timeout(3000),
    });
    if (res.status === 401 || res.status === 403)
      return { ok: false, invalid: true };
    if (!res.ok) return { ok: false, invalid: false };

    const cookies = parseAuthCookies(res);
    return cookies.some((c) => c.name === ACCESS_COOKIE)
      ? { ok: true, cookies }
      : { ok: false, invalid: false };
  } catch {
    return { ok: false, invalid: false }; // timeout or network error: don't log the user out
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthPage = inSection(pathname, "/auth");

  let payload = await verifyAccessToken(
    request.cookies.get(ACCESS_COOKIE)?.value,
  );
  let newCookies: Cookie[] = [];
  let sessionInvalid = false;

  // Access token missing/expired → try to refresh
  if (!payload) {
    const rt = request.cookies.get(REFRESH_COOKIE)?.value;

    if (rt) {
      const result = await refreshSession(rt);
      if (result.ok) {
        const access = result.cookies.find(
          (c) => c.name === ACCESS_COOKIE,
        )?.value;
        payload = await verifyAccessToken(access);
        if (payload) {
          newCookies = result.cookies;
          // So Server Components in THIS request see the new tokens
          for (const c of newCookies) request.cookies.set(c.name, c.value);
        } else {
          sessionInvalid = true; // API issued a token we can't verify; bad state
        }
      } else {
        sessionInvalid = result.invalid;
      }
    } else if (request.cookies.has(ACCESS_COOKIE)) {
      sessionInvalid = true; // garbage/expired access cookie and nothing to refresh with
    }
  }

  // ── Unauthenticated ───────────────────────────────────────────
  if (!payload) {
    let response: NextResponse;

    if (isAuthPage || isPublic(pathname)) {
      response = NextResponse.next();
    } else {
      const url = new URL("/auth/signin", request.url);
      url.searchParams.set("redirect", pathname + search); // the `pathname !== "/"` check is gone; "/" never gets here
      response = NextResponse.redirect(url);
    }

    if (sessionInvalid) {
      response.cookies.delete(ACCESS_COOKIE);
      response.cookies.delete(REFRESH_COOKIE);
    }
    return response;
  }

  // ── Authenticated ─────────────────────────────────────────────
  // (verified/banned checks live in the DAL: requireUser())
  let response: NextResponse;

  if (pathname === "/") {
    // Signed-in users skip the landing page
    response = NextResponse.redirect(new URL("/home", request.url));
  } else if (GUEST_ONLY.some((p) => inSection(pathname, p))) {
    const target = safeRedirect(request.nextUrl.searchParams.get("redirect"));
    response = NextResponse.redirect(new URL(target, request.url));
  } else {
    response = NextResponse.next({ request });
  }

  // Persist refreshed cookies on whatever response we return (including redirects)
  for (const c of newCookies) {
    response.cookies.set(c.name, c.value, {
      ...cookieBase,
      maxAge: c.maxAge,
      expires: c.expires,
    });
  }
  return response;
}

export const config = {
  matcher: [
    // everything except API routes, Next internals and files with an extension
    "/((?!api(?:/|$)|_next/static|_next/image|favicon\\.ico|.*\\..*).*)",
  ],
};
