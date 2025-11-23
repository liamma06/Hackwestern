import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const status = await req.json(); // status is true or false
  const value = status ? 1 : 0;
  return NextResponse.json({
    status: 'success',
    received: value
  });
}