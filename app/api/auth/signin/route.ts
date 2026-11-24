// app/api/auth/login/route.ts (Next.js Route Handler)
import { API_BASE_URL } from "@/lib/constants";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // 1. Call your Express backend
  const res = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok)
    return Response.json({ error: "Sign in failed" }, { status: 401 });

  const { token, refreshToken } = await res.json();

  // 2. Store in httpOnly cookie on the Next.js domain
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60, // 15 min access token
  });
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/refresh", // only sent to the refresh route
    maxAge: 7 * 24 * 60 * 60,
  });

  return Response.json({ ok: true });
}
