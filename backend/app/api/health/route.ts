import { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/cors';

export async function GET(req: NextRequest) {
  return jsonResponse({
    status: 'ok',
    service: 'archivebase-backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
  });
}
