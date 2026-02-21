import { NextRequest } from 'next/server';
import { corsResponse, jsonResponse } from '@/lib/cors';
import { requireAuth } from '@/lib/auth';
import { getSubscription } from '@/lib/storage';

export async function OPTIONS() {
  return corsResponse();
}

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const baseId = req.headers.get('X-Base-Id') || req.nextUrl.searchParams.get('baseId');
  if (!baseId) {
    return jsonResponse({ success: false, error: 'Missing baseId' }, 400);
  }

  const sub = getSubscription(baseId);

  return jsonResponse({
    success: true,
    subscription: {
      tier: sub.tier,
      status: sub.status,
      currentPeriodEnd: sub.currentPeriodEnd,
      monthlyArchiveCount: sub.monthlyArchiveCount,
    },
  });
}
