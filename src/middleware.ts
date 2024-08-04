import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "./route";

// initialize NextAuth.js with the auth options that's compatible with Edge runtime
export const { auth } = NextAuth(authConfig);

// you can use auth as a wrapper for your Middleware
// request object holds information of the current session (req.auth)
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  console.log(nextUrl);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // check if user is trying to access an authentication API route
  if (isApiAuthRoute) {
    return null;
  }

  // check if user is trying to access an authentication route
  if (isAuthRoute) {
    // redirect user to '/settings' if user is logged in
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  // check if user is not logged in and is trying to access a non-public route
  // this check needs to be done last, otherwise infinite redirect loop to '/auth/login'
  if (!isLoggedIn && !isPublicRoute) {
    // redirect user to login page
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return null;
});

// determine when the middleware function should run
export const config = {
  matcher: [
    // Every single route will invoke the middleware, except for Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Middleware will always be invoked for all API routes
    "/(api|trpc)(.*)",
  ],
};
