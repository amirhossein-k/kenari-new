import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE = "kenari_admin";

function secret() {
  return new TextEncoder().encode(process.env.JWT_SECRET || "kenari-demo-secret-change-me");
}

export async function signAdminToken(username: string) {
  return new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyAdminToken(token?: string | null) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as { username: string; role: string };
  } catch {
    return null;
  }
}
