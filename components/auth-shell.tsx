import { getCurrentUser } from "@/lib/auth/dal";
import { AuthProvider } from "./providers/auth";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const userPromise = getCurrentUser(); // NOT awaited
  return <AuthProvider userPromise={userPromise}>{children}</AuthProvider>;
}
