import { NextResponse } from "next/server";
import { ADMIN_COOKIE, signAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = (await req.json()) as { username?: string; password?: string };
  const U = process.env.ADMIN_USERNAME || "admin";
  const P = process.env.ADMIN_PASSWORD || "admin123";
  if (username !== U || password !== P) {
    return NextResponse.json({ error: "نام کاربری یا رمز عبور اشتباه است" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await signAdminToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
