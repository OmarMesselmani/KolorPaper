import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // The /admin page renders the login form itself. Protect admin APIs here.
  const isAdminApi = request.nextUrl.pathname.startsWith('/api/admin');
  const isLoginRoute = pathname === '/api/admin/login';
  const isLogoutRoute = pathname === '/api/admin/logout';
  const isVerifyRoute = pathname === '/api/admin/verify-token';

  if (isAdminApi && !isLoginRoute && !isLogoutRoute && !isVerifyRoute) {
    const token = request.cookies.get('admin_token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      
      // Verify token hash against the database to ensure password hasn't changed
      const verifyUrl = new URL('/api/admin/verify-token', request.url);
      const verifyRes = await fetch(verifyUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      });
      
      if (!verifyRes.ok) {
        return NextResponse.json({ error: 'Unauthorized: Session invalidated' }, { status: 401 });
      }

      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
