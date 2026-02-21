/**
 * WARNING: In-memory storage — all data is lost on every Vercel cold start or redeploy.
 * This means paid subscribers will temporarily appear as "free" until the next webhook event.
 *
 * Before going to production, replace these Maps with a persistent store
 * (e.g., Vercel KV, Supabase, PlanetScale) so that subscription state survives restarts.
 */

// In-memory store (resets on cold start)
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
