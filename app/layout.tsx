import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";

import { Suspense } from "react";
import { AuthShell } from "@/components/auth-shell";
import Spinner from "@/components/spinner";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eventspree",
  description: "Plan events, end to end.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col w-full bg-neutral-50">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <Spinner />
            </div>
          }
        >
          <AuthShell>{children}</AuthShell>
        </Suspense>
      </body>
    </html>
  );
}
