import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that don't require authentication (public + auth paths)
const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/oauth',
  '/home',
  '/mentorship',
  '/resources',
  '/events',
  '/contact-us'
];

// Define paths that should redirect to home if already authenticated
const authOnlyPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/oauth'
];

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Get auth token from cookies
  const authToken = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!authToken;

  // Create URLs for redirects
  const homePage = new URL('/home', request.url);
  const loginPage = new URL('/auth/login', request.url);

  // Allow access to root path (/) for all users
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Special handling for verify-email with token
  if (pathname.startsWith('/auth/verify-email')) {
    if (!isAuthenticated && !searchParams.has('token')) {
      return NextResponse.redirect(loginPage);
    }
    return NextResponse.next();
  }

  // Redirect authenticated users trying to access auth pages to /home
  if (isAuthenticated && authOnlyPaths.includes(pathname)) {
    return NextResponse.redirect(homePage);
  }

  // Allow access to public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Protect all other routes - redirect to login if not authenticated
  if (!isAuthenticated) {
    return NextResponse.redirect(loginPage);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};
