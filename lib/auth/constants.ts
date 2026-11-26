export const ACCESS_COOKIE = "accessToken";
export const REFRESH_COOKIE = "refreshToken";
export const API_URL = process.env.API_BASE_URL!; // server-only env var

export const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number; // seconds
  refreshExpiresIn: number;
};
