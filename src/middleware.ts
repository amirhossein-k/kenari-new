import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";
  if (isLogin) return NextResponse.next();

  const session = await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);
  if (session) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
