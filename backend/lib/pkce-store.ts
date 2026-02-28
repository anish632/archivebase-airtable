/**
 * In-memory store that maps a random `state` token to a PKCE `code_verifier`.
 *
 * Entries auto-expire after 10 minutes so stale flows don't leak memory.
 * This works for single-instance / serverless deployments where the same
 * warm instance handles both /connect and /callback within seconds.
 */

const TTL_MS = 10 * 60 * 1000; // 10 minutes

const store = new Map<string, { codeVerifier: string; expiresAt: number }>();

export function saveCodeVerifier(state: string, codeVerifier: string) {
  store.set(state, { codeVerifier, expiresAt: Date.now() + TTL_MS });
}

export function consumeCodeVerifier(state: string): string | null {
  const entry = store.get(state);
  if (!entry) return null;
  store.delete(state);
  if (Date.now() > entry.expiresAt) return null;
  return entry.codeVerifier;
}
