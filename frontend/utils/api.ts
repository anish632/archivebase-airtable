/**
 * Backend API client for ArchiveBase.
 * All calls go to the deployed backend (Vercel).
 */

// This gets set at build/deploy time. For dev, use localhost.
const API_BASE = 'https://archivebase-backend.vercel.app';

async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res.json();
}

/** Check license/subscription status for a base */
export async function getLicense(baseId: string) {
  return apiFetch(`/api/license?baseId=${encodeURIComponent(baseId)}`);
}

/** Log an archive operation and check limits */
export async function logArchiveOperation(params: {
  baseId: string;
  tableId: string;
  recordCount: number;
  ruleId: string;
  ruleName: string;
}) {
  return apiFetch('/api/archive', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/** Get archive history for a base */
export async function getArchiveHistory(baseId: string) {
  return apiFetch(`/api/archive?baseId=${encodeURIComponent(baseId)}`);
}

/** Create a checkout session for upgrading */
export async function createCheckout(baseId: string, tier: 'pro' | 'team') {
  return apiFetch('/api/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({ baseId, tier }),
  });
}

/** Get subscription status */
export async function getSubscription(baseId: string) {
  return apiFetch(`/api/billing/subscription?baseId=${encodeURIComponent(baseId)}`);
}
