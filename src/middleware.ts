import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './utils/auth';

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname === '/api/notification' ||
    req.nextUrl.pathname === '/notificationInfo' ||
    req.nextUrl.pathname === 'api/trpc/order.notification'
  ) {
    return;
  }

  if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const token = req.cookies.get('user-token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', req.url));
  const verifiedToken =
    token &&
    (await verifyAuth(token).catch(err => {
      console.error(err);
    }));

  if (
    verifiedToken === ''
  )
    return NextResponse.redirect(new URL('/login', req.url));

  if (
    verifiedToken &&
    req.nextUrl.pathname === `/users/edit/${verifiedToken?.id}`
  ) {
    return;
  } else if (
    verifiedToken?.role === 'user' &&
    verifiedToken &&
    req.nextUrl.pathname.startsWith(`/users/edit`)
  ) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (
    verifiedToken &&
    req.nextUrl.pathname === '/users/create' &&
    verifiedToken?.role !== 'admin'
  ) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/login') && !verifiedToken) {
    return;
  }

  if (req.url.includes('/login') && verifiedToken) {
    return NextResponse.redirect(new URL('/pdv', req.url));
  }

  if (!verifiedToken) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/',
    '/pdv',
    '/users',
    '/login',
    '/pdv/:path*',
    '/users/:path*',
  ],
};
