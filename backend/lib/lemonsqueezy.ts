const LEMON_SQUEEZY_API = 'https://api.lemonsqueezy.com/v1';

function getApiKey(): string {
  const key = process.env.LEMONSQUEEZY_API_KEY;
  if (!key) throw new Error('LEMONSQUEEZY_API_KEY not configured');
  return key;
}

export async function createCheckout(params: {
  storeId: string;
  variantId: string;
  customData?: Record<string, string>;
}) {
  const res = await fetch(`${LEMON_SQUEEZY_API}/checkouts`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          custom_price: null,
          product_options: { redirect_url: '' },
          checkout_data: { custom: params.customData || {} },
        },
        relationships: {
          store: { data: { type: 'stores', id: params.storeId } },
          variant: { data: { type: 'variants', id: params.variantId } },
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Lemon Squeezy error: ${err}`);
  }

  const data = await res.json();
  return data.data.attributes.url as string;
}

export async function getSubscription(subscriptionId: string) {
  const res = await fetch(`${LEMON_SQUEEZY_API}/subscriptions/${subscriptionId}`, {
    headers: {
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${getApiKey()}`,
    },
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.data;
}

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
