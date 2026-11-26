"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  type SigninInput,
  signinSchema,
  type SignupInput,
  signupSchema,
  type VerifyEmailInput,
  verifyEmailSchema,
} from "@/lib/validators/auth";
import { safeRedirect } from "@/lib/auth/redirect";
import { apiFetch, relayAuthCookies } from "../auth/api";
import z from "zod";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, { errors: string[] } | undefined>;
};

export async function signin(
  formData: SigninInput,
  redirectUrl?: string,
): Promise<FormState> {
  const parsed = signinSchema.safeParse(formData); // validate on the server too
  if (!parsed.success)
    return { fieldErrors: z.treeifyError(parsed.error).properties };

  const res = await apiFetch("/auth/signin", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    console.log(body);
    if (body?.code === "EMAIL_NOT_VERIFIED")
      redirect(
        `/auth/verify-email?email=${encodeURIComponent(parsed.data.email)}`,
      );
    return { error: body?.message ?? "Something went wrong" };
  }
  await relayAuthCookies(res);
  redirect(safeRedirect(redirectUrl ? redirectUrl : "/home"));
}

export async function signup(formData: SignupInput): Promise<FormState> {
  const parsed = signupSchema.safeParse(formData);
  if (!parsed.success)
    return { fieldErrors: z.treeifyError(parsed.error).properties };

  const res = await apiFetch("/auth/signup", {
    body: JSON.stringify(parsed.data),
  });
  if (!res.ok) return { error: "Could not create account" };

  redirect(`/auth/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
}
// actions/auth.ts
export async function verifyEmail(
  formData: VerifyEmailInput,
): Promise<FormState> {
  const parsed = verifyEmailSchema.safeParse(formData);
  if (!parsed.success) return { error: "Enter the 6-digit code." };

  const res = await apiFetch("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return { error: body?.message ?? "Invalid or expired code." };
  }

  await relayAuthCookies(res);
  redirect("/home");
}

export async function resendEmailOtp(formData: { email: string }) {
  const res = await apiFetch("/auth/verify-email/resend", {
    body: JSON.stringify(formData),
    method: "POST",
  });
  if (!res.ok) throw new Error("Could not resend. Try again.");
}

export async function signout() {
  await apiFetch("/auth/logout", { method: "POST" }, true).catch(() => {});
  const jar = await cookies();
  jar.delete("accessToken");
  jar.delete("refreshToken");
  redirect("/auth/signin");
}
