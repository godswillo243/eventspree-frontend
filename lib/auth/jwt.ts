import { jwtVerify, type JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);
// If your API signs with asymmetric keys, use createRemoteJWKSet(new URL(JWKS_URL)) instead.

export async function verifyAccessToken(
  token?: string,
): Promise<JWTPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null; // expired or invalid
  }
}
