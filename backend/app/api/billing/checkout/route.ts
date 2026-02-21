import { NextRequest } from 'next/server';
import { corsResponse, jsonResponse } from '@/lib/cors';
import { createCheckout } from '@/lib/lemonsqueezy';

export async function OPTIONS() {
  return corsResponse();
}

export async function POST(req: NextRequest) {
  try {
    const { tier, baseId } = await req.json();

    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    if (!storeId) {
      return jsonResponse({ success: false, error: 'Store not configured' }, 500);
    }

    // Map tier to Lemon Squeezy variant IDs (set these in env vars)
    const variantMap: Record<string, string | undefined> = {
      pro: process.env.LEMONSQUEEZY_PRO_VARIANT_ID,
      team: process.env.LEMONSQUEEZY_TEAM_VARIANT_ID,
    };

    const variantId = variantMap[tier];
    if (!variantId) {
      return jsonResponse({ success: false, error: `Invalid tier: ${tier}` }, 400);
    }

    const checkoutUrl = await createCheckout({
      storeId,
      variantId,
      customData: { base_id: baseId },
    });

    return jsonResponse({ success: true, checkoutUrl });
  } catch (error) {
    console.error('Checkout error:', error);
    return jsonResponse({ success: false, error: 'Failed to create checkout' }, 500);
  }
}
