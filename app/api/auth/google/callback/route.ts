// app/api/auth/google/callback/route.ts
import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { apiFetch, applyAuthCookies } from "@/lib/auth/api";
import { safeRedirect } from "@/lib/auth/redirect";

const safeEqual = (a: string, b: string) =>
  a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export async function GET(req: NextRequest) {
  const origin = process.env.APP_URL ?? req.nextUrl.origin;
  const params = req.nextUrl.searchParams;

  const saved = req.cookies.get("g_state")?.value;
  const verifier = req.cookies.get("g_verifier")?.value;
  const next = safeRedirect(req.cookies.get("post_auth")?.value);

  const finish = (res: NextResponse) => {
    // one-time use: always clear flow cookies
    res.cookies.delete("g_state");
    res.cookies.delete("g_verifier");
    res.cookies.delete("post_auth");
    return res;
  };
  const fail = (reason: string) =>
    finish(
      NextResponse.redirect(new URL(`/auth/signin?error=${reason}`, origin)),
    );

  if (params.get("error")) return fail("oauth_denied"); // user clicked "Cancel"

  const code = params.get("code");
  const state = params.get("state");
  if (!code || !state || !saved || !verifier || !safeEqual(state, saved)) {
    return fail("oauth");
  }

  let apiRes: Response;
  try {
    apiRes = await apiFetch("/auth/google", {
      method: "POST",
      body: JSON.stringify({ code, codeVerifier: verifier }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return fail("oauth");
  }
  if (!apiRes.ok) {
    const body = await apiRes.json().catch(() => null);
    return fail(body?.code === "ACCOUNT_DISABLED" ? "disabled" : "oauth");
  }

  const res = NextResponse.redirect(new URL(next, origin));
  applyAuthCookies(res, apiRes); // relay accessToken + refreshToken
  return finish(res);
}
