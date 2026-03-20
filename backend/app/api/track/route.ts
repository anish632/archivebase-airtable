import { NextRequest } from 'next/server';
import { corsResponse, jsonResponse } from '@/lib/cors';
import { trackEvent } from '@/lib/db';

export async function OPTIONS() {
  return corsResponse();
}

export async function POST(req: NextRequest) {
  try {
    const { baseId, eventType, eventData } = await req.json();

    if (!baseId || !eventType) {
      return jsonResponse({ success: false, error: 'Missing baseId or eventType' }, 400);
    }

    // Validate event type
    const validEventTypes = [
      'archive_started',
      'archive_completed',
      'archive_failed',
      'base_connected',
      'rule_created',
      'rule_updated',
      'rule_deleted',
      'subscription_created',
      'subscription_updated',
      'subscription_canceled',
    ];

    if (!validEventTypes.includes(eventType)) {
      return jsonResponse({ 
        success: false, 
        error: `Invalid eventType. Must be one of: ${validEventTypes.join(', ')}` 
      }, 400);
    }

    await trackEvent({ baseId, eventType, eventData });

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    return jsonResponse({ success: false, error: 'Failed to track event' }, 500);
  }
}
