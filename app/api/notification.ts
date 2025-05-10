import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  // In production, forward this to the MiniKit notification service with the user's token
  // For demo, just echo the request
  return NextResponse.json({ received: true, body });
} 