import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that don't require authentication (public + auth paths)
const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/oauth'
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

  // Check if user is authenticated
  const isAuthenticated = !!authToken;

  // Create URLs for redirects
  const signInPage = new URL('/auth/login', request.url);
  const homePage = new URL('/', request.url);

  // Special handling for verify-email with token
  if (pathname.startsWith('/auth/verify-email') && !isAuthenticated) {
    const hasToken = searchParams.has('token');
    if (!hasToken) {
      return NextResponse.redirect(signInPage);
    }
    return NextResponse.next();
  }

  // Redirect authenticated users trying to access auth pages back to home
  if (isAuthenticated && authOnlyPaths.includes(pathname)) {
    return NextResponse.redirect(homePage);
  }

  // Allow access to public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Protect all other routes
  if (!isAuthenticated) {
    signInPage.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInPage);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};
