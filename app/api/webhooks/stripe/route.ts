import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get('stripe-signature')!;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            console.error(`❌ Webhook signature verification failed:`, message);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        console.log(`✅ Stripe webhook received: ${event.type}`);

        // Handle checkout.session.completed
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            const clerkId = session.metadata?.clerkId;
            const planFromMetadata = session.metadata?.plan; // We pass this in checkout

            if (!clerkId) {
                console.error('❌ No clerkId in session metadata');
                return NextResponse.json({ error: 'Missing clerkId' }, { status: 400 });
            }

            // Use plan from metadata (more reliable than parsing price ID)
            let plan = 'free';
            if (planFromMetadata === 'basic') {
                plan = 'basic';
            } else if (planFromMetadata === 'plus') {
                plan = 'plus';
            }

            console.log(`📝 Updating user ${clerkId} to plan: ${plan}`);

            // Upsert user with new plan
            await prisma.user.upsert({
                where: { clerkId },
                update: {
                    plan,
                    stripeCustomerId: session.customer as string,
                },
                create: {
                    clerkId,
                    email: session.customer_email || undefined,
                    plan,
                    stripeCustomerId: session.customer as string,
                },
            });

            console.log(`✅ User ${clerkId} updated to ${plan} plan`);
        }

        // Handle subscription updates
        if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            const user = await prisma.user.findUnique({
                where: { stripeCustomerId: customerId },
            });

            if (user) {
                const newPlan = subscription.status === 'active' ?
                    (subscription.items.data[0].price.id === process.env.STRIPE_PRICE_PLUS ? 'plus' : 'basic') :
                    'free';

                await prisma.user.update({
                    where: { id: user.id },
                    data: { plan: newPlan },
                });

                console.log(`✅ Subscription updated for user ${user.clerkId} to ${newPlan}`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: unknown) {
        console.error('❌ Webhook error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
