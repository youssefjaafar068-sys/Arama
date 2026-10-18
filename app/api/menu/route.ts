import { NextResponse } from 'next/server';
import { menuItems as defaultMenuItems } from '@/data/mockData';

export async function GET() {
  return NextResponse.json(defaultMenuItems);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, items: body.items });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 });
  }
}
