import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export const AUTH_COOKIE = "shipper_auth";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export type AuthToken = {
  userId: string;
  name: string;
  imageUrl?: string | null;
};

export async function signAuthToken(payload: AuthToken) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload as unknown as AuthToken;
}

export async function getAuth(req: NextRequest): Promise<AuthToken | null> {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}
