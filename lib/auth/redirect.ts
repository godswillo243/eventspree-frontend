// lib/auth/redirect.ts
export function safeRedirect(r?: string | null, fallback = "/home") {
  // same-origin paths only; blocks //evil.com, /\evil.com, and auth-page loops
  return r && /^\/(?![/\\])/.test(r) && !r.startsWith("/auth") ? r : fallback;
}
