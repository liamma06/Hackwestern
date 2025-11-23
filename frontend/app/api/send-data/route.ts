import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  // You can process or store the data here if needed

  // Just echo the received data back
  return NextResponse.json({
    status: 'success',
    received: data,
  });
}