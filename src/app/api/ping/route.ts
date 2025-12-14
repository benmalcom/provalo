import { NextResponse } from 'next/server';

export function GET() {
  const data: Record<string, string> = {
    status: 'OK',
    message: 'Health check successful - v1',
  };
  return NextResponse.json(data);
}
