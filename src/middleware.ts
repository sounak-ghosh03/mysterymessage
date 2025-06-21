import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/",
        "/sign-in",
        "/sign-up",
        "/verify/:path*",
    ],
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;
    const { pathname } = url;

    const isAuthPage =
        pathname === "/" ||
        pathname.startsWith("/sign-in") ||
        pathname.startsWith("/sign-up") ||
        pathname.startsWith("/verify");

    // 🔁 Prevent redirect loop: If unauthenticated and already on /sign-in, allow access
    if (!token && pathname === "/sign-in") {
        return NextResponse.next();
    }

    // ✅ Redirect authenticated users away from public/auth pages to dashboard
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // ✅ Redirect unauthenticated users trying to access dashboard
    if (!token && pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // ✅ Allow everything else
    return NextResponse.next();
}
