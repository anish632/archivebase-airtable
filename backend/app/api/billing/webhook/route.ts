import { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/cors';
import { verifyWebhookSignature } from '@/lib/lemonsqueezy';
import { setSubscription, getSubscription } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

    // Verify signature — if secret is configured, require a valid signature
    if (secret) {
      if (!signature || !verifyWebhookSignature(rawBody, signature, secret)) {
        return jsonResponse({ success: false, error: 'Invalid signature' }, 401);
      }
    }

    const event = JSON.parse(rawBody);
    const eventName = event.meta?.event_name;
    const customData = event.meta?.custom_data || {};
    const baseId = customData.base_id;
    const attrs = event.data?.attributes || {};

    if (!baseId) {
      console.warn('Webhook missing base_id in custom_data');
      return jsonResponse({ success: true, message: 'No base_id, skipped' });
    }

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated': {
        // Determine tier from variant name or product
        const variantName = (attrs.variant_name || '').toLowerCase();
        const tier = variantName.includes('team') ? 'team' : 'pro';

        const existing = getSubscription(baseId);
        setSubscription(baseId, {
          ...existing,
          tier,
          status: attrs.status === 'active' ? 'active' : 'canceled',
          subscriptionId: String(event.data?.id),
          customerId: String(attrs.customer_id),
          currentPeriodEnd: attrs.renews_at,
        });
        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        const existing = getSubscription(baseId);
        setSubscription(baseId, {
          ...existing,
          tier: 'free',
          status: 'expired',
        });
        break;
      }
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return jsonResponse({ success: false, error: 'Webhook processing failed' }, 500);
  }
}
