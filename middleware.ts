import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, JWTPayload } from '@/app/lib/auth';

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const protectedPaths = ['/dashboard', '/chat'];
  const currentPath = request.nextUrl.pathname;

  const isProtectedPath = protectedPaths.some((path) =>
    currentPath.startsWith(path)
  );

  if (isProtectedPath) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', currentPath);
      return NextResponse.redirect(loginUrl);
    }

    const payload = verifyToken(token);
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', currentPath);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*', '/login'],
};
