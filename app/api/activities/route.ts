import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find user by Clerk ID
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json({ activities: [] });
        }

        // Get user's activities, ordered by most recent
        const activities = await prisma.activity.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 50, // Limit to last 50 activities
            select: {
                id: true,
                childName: true,
                ageGroup: true,
                topic: true,
                activityType: true,
                title: true,
                content: true,
                imageBase64: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ activities });

    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }
}

