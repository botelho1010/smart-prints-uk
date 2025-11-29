import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes (routes that REQUIRE authentication)
// /generate is NOT in this list, so it will be publicly accessible
const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",  // Example: protect /dashboard if you add it later
    // Add other protected routes here as needed
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
    // /generate and other routes not in isProtectedRoute are publicly accessible
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
