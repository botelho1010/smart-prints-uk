import { auth as clerkAuth, clerkClient as clerkClientLib } from "@clerk/nextjs/server";
import { prisma } from "./prismadb";

export const FREE_LIMITS = {
    maxImages: 1,
    maxNonImages: 2,
};

export const BASIC_LIMITS = {
    maxImagesPerDay: 10,
};

export async function checkSubscription() {
    const { userId } = await clerkAuth();
    if (!userId) return null;

    const client = await clerkClientLib();
    const user = await client.users.getUser(userId);

    const publicMetadata = user.publicMetadata as {
        subscription?: string;
        plan?: string;
    };

    let plan = "FREE";
    if (publicMetadata.subscription === "PLUS" || publicMetadata.plan === "PLUS") {
        plan = "PLUS";
    } else if (publicMetadata.subscription === "BASIC" || publicMetadata.plan === "BASIC") {
        plan = "BASIC";
    }

    return { userId, plan };
}

export async function getUsage(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usage = await prisma.usage.findUnique({
        where: {
            userId_date: {
                userId,
                date: today,
            },
        },
    });

    return usage || { imageCount: 0, nonImageCount: 0 };
}

export async function checkUsage(isImage: boolean) {
    const sub = await checkSubscription();
    if (!sub) return { allowed: true, plan: "FREE" }; // Anonymous users handled by client

    const { userId, plan } = sub;

    if (plan === "PLUS") return { allowed: true, plan };

    const usage = await getUsage(userId);

    if (plan === "BASIC") {
        if (isImage) {
            if (usage.imageCount >= BASIC_LIMITS.maxImagesPerDay) {
                return { allowed: false, plan, reason: "BASIC_LIMIT" };
            }
        }
        return { allowed: true, plan };
    }

    // FREE Plan (Authenticated)
    // Requirements say "Anonymous FREE users use localStorage".
    // But if a user IS logged in but has no plan, they are FREE.
    // Should we track them in DB? The requirements say "Track counts in DB... Anonymous FREE users use localStorage".
    // It implies authenticated users (Basic/Plus) use DB. What about authenticated FREE users?
    // "If user is NOT signed in and is using FREE plan rules... If user is BASIC... If user is PLUS..."
    // It doesn't explicitly say what to do with Authenticated FREE users.
    // I will assume Authenticated FREE users also use DB limits for consistency, OR they fall back to client limits.
    // Given "Anonymous FREE users use localStorage", it suggests Auth users use DB.
    // Let's enforce FREE limits in DB for Auth users too.

    if (plan === "FREE") {
        // Check total usage (not just daily)? 
        // "User can generate: 1 AI image... 2 non-image... After that, block"
        // This sounds like a lifetime limit for the free tier?
        // "You've used your free activities."
        // Yes, lifetime.

        // We need to check ALL time usage for Free users?
        // The model has `date`.
        // If we want lifetime, we sum up all usage? Or we just check the current record?
        // "Track counts in DB using a new model... date DateTime".
        // This model is designed for daily tracking.
        // If we want lifetime free limits for auth users, we'd need to query ALL records for that user.

        const allUsage = await prisma.usage.aggregate({
            where: { userId },
            _sum: {
                imageCount: true,
                nonImageCount: true,
            },
        });

        const totalImages = allUsage._sum.imageCount || 0;
        const totalNonImages = allUsage._sum.nonImageCount || 0;

        if (isImage) {
            if (totalImages >= FREE_LIMITS.maxImages) {
                return { allowed: false, plan, reason: "FREE_LIMIT" };
            }
        } else {
            if (totalNonImages >= FREE_LIMITS.maxNonImages) {
                return { allowed: false, plan, reason: "FREE_LIMIT" };
            }
        }
    }

    return { allowed: true, plan };
}

export async function incrementUsage(userId: string, isImage: boolean) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.usage.upsert({
        where: {
            userId_date: {
                userId,
                date: today,
            },
        },
        update: {
            imageCount: { increment: isImage ? 1 : 0 },
            nonImageCount: { increment: isImage ? 0 : 1 },
        },
        create: {
            userId,
            date: today,
            imageCount: isImage ? 1 : 0,
            nonImageCount: isImage ? 0 : 1,
        },
    });
}
