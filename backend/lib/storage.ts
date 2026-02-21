/**
 * Simple in-memory + file-based storage for MVP.
 * Replace with a real database (Supabase, Planetscale, etc.) for production.
 * 
 * For now we use Vercel KV or just keep archives as JSON blobs.
 * The extension primarily exports CSVs client-side, so server storage
 * is mainly for:
 * - Subscription/license tracking per base
 * - Archive metadata (what was archived, when)
 */

// In-memory store (resets on cold start — fine for MVP with Lemon Squeezy as source of truth)
const subscriptions = new Map<string, {
  tier: 'free' | 'pro' | 'team';
  status: 'active' | 'canceled' | 'expired';
  subscriptionId?: string;
  customerId?: string;
  currentPeriodEnd?: string;
  monthlyArchiveCount: number;
  lastResetDate: string;
}>();

const archiveLog = new Map<string, Array<{
  archiveId: string;
  tableId: string;
  recordCount: number;
  archivedAt: string;
  ruleId: string;
}>>();

export function getSubscription(baseId: string) {
  return subscriptions.get(baseId) || {
    tier: 'free' as const,
    status: 'active' as const,
    monthlyArchiveCount: 0,
    lastResetDate: new Date().toISOString().slice(0, 7),
  };
}

export function setSubscription(baseId: string, data: Parameters<typeof subscriptions.set>[1]) {
  subscriptions.set(baseId, data);
}

export function logArchive(baseId: string, entry: {
  archiveId: string;
  tableId: string;
  recordCount: number;
  ruleId: string;
}) {
  const existing = archiveLog.get(baseId) || [];
  existing.push({ ...entry, archivedAt: new Date().toISOString() });
  archiveLog.set(baseId, existing);
}

export function getArchiveHistory(baseId: string) {
  return archiveLog.get(baseId) || [];
}

export function incrementArchiveCount(baseId: string, count: number) {
  const sub = getSubscription(baseId);
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  if (sub.lastResetDate !== currentMonth) {
    sub.monthlyArchiveCount = 0;
    sub.lastResetDate = currentMonth;
  }
  
  sub.monthlyArchiveCount += count;
  subscriptions.set(baseId, sub);
  return sub;
}
