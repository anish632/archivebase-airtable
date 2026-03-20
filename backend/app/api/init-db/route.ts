import { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/cors';
import { initDb } from '@/lib/db';

/**
 * One-time database initialization endpoint.
 * Creates the archivebase_events table and indexes.
 * Can be called multiple times safely (CREATE IF NOT EXISTS).
 */
export async function POST(req: NextRequest) {
  try {
    // Optional: Add basic auth protection for this endpoint
    const authHeader = req.headers.get('authorization');
    const expectedAuth = process.env.INIT_DB_SECRET || 'changeme';
    
    if (authHeader !== `Bearer ${expectedAuth}`) {
      return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
    }

    await initDb();

    return jsonResponse({
      success: true,
      message: 'Database initialized successfully',
    });
  } catch (error) {
    console.error('DB initialization error:', error);
    return jsonResponse({
      success: false,
      error: 'Failed to initialize database',
      details: String(error),
    }, 500);
  }
}
