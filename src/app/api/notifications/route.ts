import { NextResponse } from 'next/server';
import { legalNotifications } from '@/lib/legal-dashboard-data';

export async function GET() {
  return NextResponse.json({
    data: legalNotifications,
  });
}
