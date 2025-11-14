import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🟦 Biarkan halaman login bebas akses
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 🟥 Belum login → lempar ke login
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // 🟥 Bukan admin → lempar ke login
  if (token.role !== "superadmin") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // 🟩 Berhasil → lanjut
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
