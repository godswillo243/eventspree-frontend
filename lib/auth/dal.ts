import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { verifyAccessToken } from "./jwt";
import { apiFetch } from "./api"; // the helper from earlier (sends the Cookie header)
import { ACCESS_COOKIE } from "./constants";
import type { TUser } from "@/types";

export const getSession = cache(async () => {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  const payload = await verifyAccessToken(token);
  if (!payload) return null;
  return { userId: String(payload.userId) };
});

export const getCurrentUser = cache(async (): Promise<TUser | null> => {
  try {
    const session = await getSession();
    if (!session) {
      return null;
    }

    const res = await apiFetch("/auth/user", {}, true); // cookie auth
    if (!res.ok) {
      return null;
    }

    const body = await res.json();
    const u = body?.data?.user;
    if (!u?.id) {
      return null;
    }

    return {
      id: u.id,
      name: u.name ?? "",
      email: u.email,
      role: u.role,
      status: u.status,
      avatarUrl: u.avatarUrl ?? "",
    };
  } catch (e) {
    console.log("[dal] getCurrentUser threw:", e);
    return null; // must never reject, because use() would throw
  }
});
