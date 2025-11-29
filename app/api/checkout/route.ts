import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

export async function POST(req: Request) {
    try {
        // 1. AUTHENTICATE USER
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { planId } = body;

        console.log(`[Checkout] Starting for plan: ${planId}, user: ${clerkId}`);

        // 2. SELECT PRICE ID
        let priceId = '';

        if (planId === 'basic') {
            priceId = process.env.STRIPE_PRICE_BASIC || '';
        } else if (planId === 'plus') {
            priceId = process.env.STRIPE_PRICE_PLUS || '';
        }

        if (!priceId) {
            console.error("❌ Price ID not found in .env.local for plan:", planId);
            return NextResponse.json({ error: 'Price ID not configured' }, { status: 500 });
        }

        // 3. CREATE STRIPE CHECKOUT SESSION
        const successUrl = process.env.STRIPE_SUCCESS_URL || 'https://smart-prints-uk.vercel.app/checkout/success';
        const cancelUrl = process.env.STRIPE_CANCEL_URL || 'https://smart-prints-uk.vercel.app/checkout/cancel';
        
        console.log(`[Checkout] Using URLs - Success: ${successUrl}, Cancel: ${cancelUrl}`);
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                clerkId,  // ✅ CRITICAL: Pass clerkId for webhook
                plan: planId,
            },
        });

        console.log("[Checkout] Session created successfully:", session.url);

        return NextResponse.json({ url: session.url });

    } catch (error: unknown) {
        console.error("[Checkout Error]:", error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}