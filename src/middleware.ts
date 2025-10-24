import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const url = request.nextUrl.clone();

    // Define routes that don't require authentication
    const publicPaths = ['/login', '/sign-up', '/onboarding'];

    // Check if the current path is in the list of public paths
    if (publicPaths.includes(url.pathname)) {
      return NextResponse.next();
    }

    // If the user is not authenticated, redirect to the login page
    if (!request.nextauth.token) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // CHECK BAN HERE
    // const email = request.nextauth.token?.email;
    // if (email) {
    //   try {
    //     const apiUrl = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/merchant/ban-status/${email}`, request.url);
    //     // const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/merchant/ban-status/${email}`);
    //     const res = await fetch(apiUrl );
    //     const data = await res.json();

    //     if (data.isBan) {
    //       // If banned, clear the session and redirect to login
    //       const loginUrl = new URL("/login", request.url);
    //       const response = NextResponse.redirect(loginUrl);
    //       response.cookies.delete("next-auth.session-token");
    //       response.cookies.delete("next-auth.csrf-token");
    //       return response;
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch ban status:", error);
    //   }
    // }
    // CHECK BAN HERE

    // If authenticated, allow the request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    // Use the secret from environment variables
    secret: process.env.NEXTAUTH_SECRET,
  },
);

// Apply middleware to all routes except the public routes
export const config = {
  matcher: '/((?!login|sign-up|onboarding|api/payment/callback).*)',
};
