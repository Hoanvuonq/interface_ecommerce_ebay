import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RoleEnum } from '@/auth/_types/auth';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value;
  const { pathname } = request.nextUrl;

  const protectedPaths = ['/cart', '/checkout', '/orders', '/profile'];
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    if (isLoggedIn !== 'true') {
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cart/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/profile/:path*',
  ],
};
