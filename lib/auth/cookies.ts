// lib/auth/cookies.ts  (no server-only, no next/headers)
import { parse } from "set-cookie-parser";

const AUTH_COOKIES = new Set(["accessToken", "refreshToken"]);

export function parseAuthCookies(res: Response) {
  return parse(res.headers.getSetCookie(), { decodeValues: false }).filter(
    (c) => AUTH_COOKIES.has(c.name),
  );
}
