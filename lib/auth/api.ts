import "server-only";
import { cookies } from "next/headers";
import { parse } from "set-cookie-parser";
import { API_URL, cookieBase } from "./constants";
import { NextResponse } from "next/server";

const AUTH_COOKIES = new Set(["accessToken", "refreshToken"]);

export function parseAuthCookies(res: Response) {
  return parse(res.headers.getSetCookie(), { decodeValues: false }).filter(
    (c) => AUTH_COOKIES.has(c.name),
  );
}

// Relay API cookies to the browser (Server Actions / Route Handlers only)
export async function relayAuthCookies(res: Response) {
  const jar = await cookies();
  for (const c of parseAuthCookies(res)) {
    if (!c.value) jar.delete(c.name);
    else
      jar.set(c.name, c.value, {
        ...cookieBase,
        maxAge: c.maxAge,
        expires: c.expires,
      });
  }
}

export function applyAuthCookies(target: NextResponse, apiRes: Response) {
  for (const c of parseAuthCookies(apiRes)) {
    if (!c.value) target.cookies.delete(c.name);
    else
      target.cookies.set(c.name, c.value, {
        ...cookieBase,
        maxAge: c.maxAge, // seconds, from the Max-Age attribute
        expires: c.expires,
      });
  }
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
  withCookies = false,
) {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (withCookies) {
    const jar = await cookies();
    headers.set(
      "Cookie",
      jar
        .getAll()
        .filter((c) => AUTH_COOKIES.has(c.name))
        .map((c) => `${c.name}=${c.value}`)
        .join("; "),
    );
  }
  return fetch(`${API_URL}${path}`, { ...init, headers, cache: "no-store" });
}
