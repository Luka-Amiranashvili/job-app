import { NextRequest, NextResponse } from "next/server";

export function protect(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const isProtectedPath =
    request.nextUrl.pathname.startsWith("/post-job") ||
    request.nextUrl.pathname.startsWith("/applications");

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/post-job/:path*", "/applications/:path*"],
};
