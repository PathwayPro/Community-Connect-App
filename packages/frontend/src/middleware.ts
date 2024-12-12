import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that don't require authentication
const publicPaths = ['/login', '/register', 'verify-email', '/forgot-password'];

// Define paths that are only accessible to non-authenticated users
const authPaths = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies
  const authToken = request.cookies.get('cc-access-token')?.value;

  // Check if user is authenticated
  const isAuthenticated = !!authToken;

  // Create URLs for redirects
  const signInPage = new URL('/login', request.url);
  const homePage = new URL('/', request.url);

  // Redirect authenticated users trying to access auth pages back to home
  if (isAuthenticated && authPaths.includes(pathname)) {
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
