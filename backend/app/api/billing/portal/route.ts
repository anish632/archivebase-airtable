import { NextRequest } from 'next/server';
import { corsResponse, jsonResponse } from '@/lib/cors';
import { requireAuth } from '@/lib/auth';
import { getSubscription } from '@/lib/storage';
import { createPortalSession } from '@/lib/stripe';

export async function OPTIONS() {
  return corsResponse();
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const { baseId } = await req.json();

    if (!baseId) {
      return jsonResponse({ success: false, error: 'Missing baseId' }, 400);
    }

    const sub = getSubscription(baseId);

    if (!sub.customerId) {
      return jsonResponse({ success: false, error: 'No subscription found' }, 404);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://archivebase-airtable.vercel.app';
    const portalUrl = await createPortalSession({
      customerId: sub.customerId,
      returnUrl: `${baseUrl}/dashboard`,
    });

    return jsonResponse({ success: true, portalUrl });
  } catch (error) {
    console.error('Portal error:', error);
    return jsonResponse({ success: false, error: 'Failed to create portal session' }, 500);
  }
}
