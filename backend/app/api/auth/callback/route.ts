import { NextRequest, NextResponse } from 'next/server';
import { jsonResponse } from '@/lib/cors';
import { consumeCodeVerifier } from '@/lib/pkce-store';

/**
 * Airtable OAuth callback handler.
 * Exchanges the authorization code for an access token.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const error = req.nextUrl.searchParams.get('error');

  if (error) {
    return jsonResponse({ success: false, error, step: 'authorization' }, 400);
  }

  if (!code || !state) {
    return jsonResponse({ success: false, error: 'missing_code_or_state', step: 'callback' }, 400);
  }

  // Look up the PKCE code_verifier that was stored during /connect
  const codeVerifier = consumeCodeVerifier(state);
  if (!codeVerifier) {
    return jsonResponse({
      success: false,
      error: 'invalid_or_expired_state',
      step: 'callback',
      hint: 'The OAuth session expired or the state token is invalid. Please try connecting again.',
    }, 400);
  }

  try {
    const clientId = process.env.AIRTABLE_CLIENT_ID!;
    const clientSecret = process.env.AIRTABLE_CLIENT_SECRET!;
    const redirectUri = process.env.AIRTABLE_REDIRECT_URI ||
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://archivebase.dasgroupllc.com'}/api/auth/callback`;

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    });

    const tokenResponse = await fetch('https://airtable.com/oauth2/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body,
    });

    const responseText = await tokenResponse.text();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenResponse.status, responseText);
      return jsonResponse({
        success: false,
        error: 'token_exchange_failed',
        status: tokenResponse.status,
        details: responseText,
        debug: { redirectUri, hasCode: !!code, hasState: !!state }
      }, 400);
    }

    const tokens = JSON.parse(responseText);

    // For now, return success with token info (in production, store in DB and set session cookie)
    return jsonResponse({
      success: true,
      message: 'Connected to Airtable!',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      scope: tokens.scope,
    });
  } catch (err) {
    console.error('OAuth callback error:', err);
    return jsonResponse({ success: false, error: 'server_error', details: String(err) }, 500);
  }
}
