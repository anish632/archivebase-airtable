import { NextRequest } from 'next/server';
import { jsonResponse } from './cors';

/**
 * Validates the Authorization header against the configured API key.
 * The extension sends `Authorization: Bearer <ARCHIVEBASE_API_KEY>`.
 *
 * Returns null if authorized, or an error Response if not.
 */
export function requireAuth(req: NextRequest) {
  const apiKey = process.env.ARCHIVEBASE_API_KEY;
  if (!apiKey) {
    // If no key is configured, allow all requests (dev mode).
    return null;
  }

  const header = req.headers.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!token || token !== apiKey) {
    return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
  }

  return null;
}
