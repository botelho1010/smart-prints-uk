import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const runtime = 'nodejs';

/**
 * DEV-ONLY: Reset free plan usage for current user
 * Deletes all daily usage records for the authenticated user
 */
export async function POST() {
    try {
        // Only allow in development
        if (process.env.NODE_ENV !== 'development') {
            return NextResponse.json({ error: 'Only available in development' }, { status: 403 });
        }

        // Authenticate user
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find user in database
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Delete all daily usage records for this user
        const deleted = await prisma.dailyUsage.deleteMany({
            where: { userId: user.id },
        });

        console.log(`✅ DEV: Reset usage for user ${userId} - deleted ${deleted.count} records`);

        return NextResponse.json({
            success: true,
            message: `Reset ${deleted.count} usage records`,
            deletedCount: deleted.count
        });

    } catch (error: unknown) {
        console.error('❌ DEV: Error resetting usage:', error);
        const message = error instanceof Error ? error.message : 'Failed to reset usage';
        return NextResponse.json({
            error: message
        }, { status: 500 });
    }
}
