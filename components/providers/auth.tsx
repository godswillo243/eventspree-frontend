"use client";

import { createContext, use, useContext } from "react";
import type { TUser } from "@/types";

type UserPromise = Promise<TUser | null>;

const Ctx = createContext<UserPromise | undefined>(undefined);

export function AuthProvider({
  userPromise,
  children,
}: {
  userPromise: UserPromise;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={userPromise}>{children}</Ctx.Provider>;
}

/** Returns the user, or null when signed out. Suspends until resolved. */
export function useUser(): TUser | null {
  const promise = useContext(Ctx);
  if (promise === undefined) {
    throw new Error("useUser must be used within AuthProvider");
  }
  return use(promise);
}

/** For components that only render when signed in (e.g. under requireUser()). */
export function useRequiredUser(): TUser {
  const user = useUser();
  if (!user) throw new Error("Expected an authenticated user");
  return user;
}
