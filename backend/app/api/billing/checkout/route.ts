import { NextRequest } from 'next/server';
import { corsResponse, jsonResponse } from '@/lib/cors';
import { requireAuth } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

export async function OPTIONS() {
  return corsResponse();
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const { tier, baseId, email } = await req.json();

    // Map tier to Stripe price IDs
    const priceMap: Record<string, string | undefined> = {
      pro: process.env.ARCHIVEBASE_PRO_PRICE_ID,
      team: process.env.ARCHIVEBASE_TEAM_PRICE_ID,
    };

    const priceId = priceMap[tier];
    if (!priceId) {
      return jsonResponse({ success: false, error: `Invalid tier: ${tier}` }, 400);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://archivebase-airtable.vercel.app';
    const checkoutUrl = await createCheckoutSession({
      priceId,
      customerEmail: email,
      metadata: { base_id: baseId, tier },
      successUrl: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
    });

    return jsonResponse({ success: true, checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return jsonResponse({ success: false, error: 'Failed to create checkout' }, 500);
  }
}
