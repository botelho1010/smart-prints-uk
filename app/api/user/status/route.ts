import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET() {
    try {
        // 1. Authenticate
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Get or create user
        let user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    plan: 'free'
                }
            });
        }

        // 3. Get today's usage
        const today = new Date().toISOString().split('T')[0];

        const dailyUsage = await prisma.dailyUsage.findUnique({
            where: {
                userId_date: {
                    userId: user.id,
                    date: today
                }
            }
        });

        const colouringCount = dailyUsage?.colouringCount || 0;
        const drawingCount = dailyUsage?.drawingCount || 0;
        const totalUsage = colouringCount + drawingCount;

        // 4. Determine limit based on plan
        let limit = 3; // Free default
        if (user.plan === 'basic') {
            limit = 10; // 10 colouring per day
        } else if (user.plan === 'plus') {
            limit = 100; // 100 colouring per day
        }

        // 5. Return status
        return NextResponse.json({
            plan: user.plan,
            usage: totalUsage,
            colouringCount,
            drawingCount,
            limit,
            clerkId: userId
        });

    } catch (error: unknown) {
        console.error('User status error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: message
        }, { status: 500 });
    }
}
