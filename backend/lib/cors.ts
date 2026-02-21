import { NextResponse } from 'next/server';

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Base-Id',
  };
}

export function corsResponse() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export function jsonResponse(data: any, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders() });
}
