import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { saveCodeVerifier } from '@/lib/pkce-store';

export const dynamic = 'force-dynamic';

/**
 * Initiates the Airtable OAuth flow.
 * Redirects the user to Airtable's authorization page.
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.AIRTABLE_CLIENT_ID!;
  const redirectUri = process.env.AIRTABLE_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL || 'https://archivebase.dasgroupllc.com'}/api/auth/callback`;

  // PKCE code verifier and challenge
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  // Random state token for CSRF protection; store the code_verifier server-side
  const state = crypto.randomBytes(16).toString('base64url');
  saveCodeVerifier(state, codeVerifier);

  // Scopes needed for ArchiveBase
  const scopes = [
    'data.records:read',
    'data.records:write',
    'schema.bases:read',
    'user.email:read',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return NextResponse.redirect(
    `https://airtable.com/oauth2/v1/authorize?${params.toString()}`
  );
}
