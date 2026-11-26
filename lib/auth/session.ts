import "server-only";
import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieBase,
  type Tokens,
} from "./constants";

export async function setSessionCookies(t: Tokens) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, t.accessToken, {
    ...cookieBase,
    maxAge: t.accessExpiresIn,
  });
  jar.set(REFRESH_COOKIE, t.refreshToken, {
    ...cookieBase,
    maxAge: t.refreshExpiresIn,
  });
}

export async function clearSessionCookies() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}
