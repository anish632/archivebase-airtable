/**
 * Backend API client for ArchiveBase.
 * All calls go to the deployed backend (Vercel).
 */

// These get set at build/deploy time. For dev, use localhost and leave key empty.
const API_BASE = 'https://archivebase-backend.vercel.app';
const API_KEY = (typeof process !== 'undefined' && process.env?.ARCHIVEBASE_API_KEY) || '';

async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const authHeaders: Record<string, string> = {};
  if (API_KEY) {
    authHeaders['Authorization'] = `Bearer ${API_KEY}`;
  }
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!res.ok) {
    let body: any;
    try {
      body = await res.json();
    } catch {
      body = { error: `HTTP ${res.status}: ${res.statusText}` };
    }
    return { success: false, ...body };
  }

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
