/**
 * Neon Postgres database client for ArchiveBase
 */

import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDb() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL not configured');
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function initDb() {
  const db = getDb();
  
  // Create archivebase_events table if it doesn't exist
  await db.query(`
    CREATE TABLE IF NOT EXISTS archivebase_events (
      id SERIAL PRIMARY KEY,
      base_id VARCHAR(255) NOT NULL,
      event_type VARCHAR(100) NOT NULL,
      event_data JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Create index on base_id for faster queries
  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_archivebase_events_base_id 
    ON archivebase_events(base_id);
  `);
  
  // Create index on event_type for filtering
  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_archivebase_events_type 
    ON archivebase_events(event_type);
  `);
  
  // Create index on created_at for time-based queries
  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_archivebase_events_created 
    ON archivebase_events(created_at DESC);
  `);
}

export async function trackEvent(params: {
  baseId: string;
  eventType: string;
  eventData?: Record<string, any>;
}) {
  const db = getDb();
  
  await db.query(
    `INSERT INTO archivebase_events (base_id, event_type, event_data) 
     VALUES ($1, $2, $3)`,
    [params.baseId, params.eventType, JSON.stringify(params.eventData || {})]
  );
}

export async function getEventStats(params: {
  baseId?: string;
  eventType?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}) {
  const db = getDb();
  
  let query = 'SELECT * FROM archivebase_events WHERE 1=1';
  const values: any[] = [];
  let paramCount = 1;
  
  if (params.baseId) {
    query += ` AND base_id = $${paramCount}`;
    values.push(params.baseId);
    paramCount++;
  }
  
  if (params.eventType) {
    query += ` AND event_type = $${paramCount}`;
    values.push(params.eventType);
    paramCount++;
  }
  
  if (params.startDate) {
    query += ` AND created_at >= $${paramCount}`;
    values.push(params.startDate);
    paramCount++;
  }
  
  if (params.endDate) {
    query += ` AND created_at <= $${paramCount}`;
    values.push(params.endDate);
    paramCount++;
  }
  
  query += ' ORDER BY created_at DESC';
  
  if (params.limit) {
    query += ` LIMIT $${paramCount}`;
    values.push(params.limit);
  }
  
  const result = await db.query(query, values);
  return result.rows;
}

export async function getEventCounts(params: {
  baseId?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const db = getDb();
  
  let query = `
    SELECT event_type, COUNT(*) as count 
    FROM archivebase_events 
    WHERE 1=1
  `;
  const values: any[] = [];
  let paramCount = 1;
  
  if (params.baseId) {
    query += ` AND base_id = $${paramCount}`;
    values.push(params.baseId);
    paramCount++;
  }
  
  if (params.startDate) {
    query += ` AND created_at >= $${paramCount}`;
    values.push(params.startDate);
    paramCount++;
  }
  
  if (params.endDate) {
    query += ` AND created_at <= $${paramCount}`;
    values.push(params.endDate);
    paramCount++;
  }
  
  query += ' GROUP BY event_type ORDER BY count DESC';
  
  const result = await db.query(query, values);
  return result.rows;
}
