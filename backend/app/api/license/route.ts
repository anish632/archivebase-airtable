import { NextRequest } from 'next/server';
import { corsResponse, jsonResponse } from '@/lib/cors';
import { getSubscription } from '@/lib/storage';

export async function OPTIONS() {
  return corsResponse();
}

export async function GET(req: NextRequest) {
  const baseId = req.headers.get('X-Base-Id') || req.nextUrl.searchParams.get('baseId');
  if (!baseId) {
    return jsonResponse({ success: false, error: 'Missing baseId' }, 400);
  }

  const sub = getSubscription(baseId);
  
  const limits = {
    free: { monthlyRecords: 500, bases: 1, scheduledArchives: false },
    pro: { monthlyRecords: null, bases: 10, scheduledArchives: true },
    team: { monthlyRecords: null, bases: null, scheduledArchives: true },
  };

  return jsonResponse({
    success: true,
    license: {
      tier: sub.tier,
      status: sub.status,
      limits: limits[sub.tier],
      usage: {
        monthlyArchiveCount: sub.monthlyArchiveCount,
        lastResetDate: sub.lastResetDate,
      },
      currentPeriodEnd: sub.currentPeriodEnd,
    },
  });
}
