import { NextRequest } from 'next/server';
import { corsResponse, jsonResponse } from '@/lib/cors';
import { requireAuth } from '@/lib/auth';
import { getSubscription, logArchive, incrementArchiveCount, getArchiveHistory } from '@/lib/storage';

const FREE_MONTHLY_LIMIT = 500;

export async function OPTIONS() {
  return corsResponse();
}

export async function POST(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const { baseId, tableId, recordCount, ruleId, ruleName } = await req.json();

    if (!baseId || !recordCount) {
      return jsonResponse({ success: false, error: 'Missing baseId or recordCount' }, 400);
    }

    // Check subscription limits
    const sub = getSubscription(baseId);
    if (sub.tier === 'free') {
      const remaining = FREE_MONTHLY_LIMIT - sub.monthlyArchiveCount;
      if (recordCount > remaining) {
        return jsonResponse({
          success: false,
          error: `Free plan limit: ${remaining} records remaining this month. Upgrade to Pro for unlimited.`,
          remainingRecords: remaining,
        }, 403);
      }
    }

    // Log the archive
    const archiveId = `archive_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    logArchive(baseId, { archiveId, tableId, recordCount, ruleId });
    incrementArchiveCount(baseId, recordCount);

    return jsonResponse({ success: true, archiveId });
  } catch (error) {
    console.error('Archive error:', error);
    return jsonResponse({ success: false, error: 'Internal server error' }, 500);
  }
}

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  const baseId = req.headers.get('X-Base-Id') || req.nextUrl.searchParams.get('baseId');
  if (!baseId) {
    return jsonResponse({ success: false, error: 'Missing baseId' }, 400);
  }

  const history = getArchiveHistory(baseId);
  return jsonResponse({ success: true, archives: history });
}
