import { NextRequest } from 'next/server';
import { corsResponse, jsonResponse } from '@/lib/cors';
import { requireAuth } from '@/lib/auth';
import { getEventStats, getEventCounts } from '@/lib/db';

export async function OPTIONS() {
  return corsResponse();
}

export async function GET(req: NextRequest) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const { searchParams } = req.nextUrl;
    const baseId = searchParams.get('baseId');
    const eventType = searchParams.get('eventType');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit');

    if (!baseId) {
      return jsonResponse({ success: false, error: 'Missing baseId parameter' }, 400);
    }

    const params: any = { baseId };
    
    if (eventType) params.eventType = eventType;
    if (startDate) params.startDate = new Date(startDate);
    if (endDate) params.endDate = new Date(endDate);
    if (limit) params.limit = parseInt(limit, 10);

    // Get recent events
    const events = await getEventStats(params);
    
    // Get event counts by type
    const counts = await getEventCounts({
      baseId,
      startDate: params.startDate,
      endDate: params.endDate,
    });

    return jsonResponse({
      success: true,
      stats: {
        events,
        counts: counts.reduce((acc: any, row: any) => {
          acc[row.event_type] = parseInt(row.count, 10);
          return acc;
        }, {}),
        totalEvents: counts.reduce((sum: number, row: any) => sum + parseInt(row.count, 10), 0),
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    return jsonResponse({ success: false, error: 'Failed to retrieve stats' }, 500);
  }
}
