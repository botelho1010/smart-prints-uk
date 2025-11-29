import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function POST() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        const devEmail = process.env.DEV_ADMIN_EMAIL;
        const isDevEnv = process.env.NODE_ENV === "development";

        const userEmails = user.emailAddresses?.map((e: { emailAddress: string }) => e.emailAddress.toLowerCase()) ?? [];
        const isDevAdmin =
            devEmail && userEmails.includes(devEmail.toLowerCase());

        if (!isDevEnv && !isDevAdmin) {
            console.error("❌ DEV reset blocked for non-dev user");
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Reset public metadata
        const todayIso = new Date().toISOString().split("T")[0];

        await client.users.updateUser(userId, {
            publicMetadata: {
                subscription: "FREE",
                subscription_status: "inactive",
                plan: null,
                images_used_today: 0,
                total_activities_generated: 0,
                image_quota_reset: todayIso,
            },
            privateMetadata: {
                stripe_customer_id: null,
                stripe_subscription_id: null,
                stripe_price_id: null,
                stripe_current_period_end: null,
            },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("❌ Error resetting subscription:", error);
        return NextResponse.json(
            { error: "Failed to reset subscription" },
            { status: 500 }
        );
    }
}
