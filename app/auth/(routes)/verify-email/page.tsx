// app/auth/verify-email/page.tsx
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import VerifyEmailForm from "../../_components/verify-email-form";

export const metadata: Metadata = { title: "Eventspree | Verify email" };
export const instant = false;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  if (!email) redirect("/auth/signin");
  return <VerifyEmailForm email={email} />;
}
