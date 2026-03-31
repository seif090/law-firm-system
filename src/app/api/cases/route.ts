import { NextResponse } from 'next/server';
import { filterCases } from '@/lib/legal-dashboard-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const status = searchParams.get('status');

  const cases = filterCases(
    query,
    status === 'جارية' || status === 'معلقة' || status === 'مغلقة' ? status : 'الكل'
  );

  return NextResponse.json({
    data: cases,
    meta: {
      total: cases.length,
    },
  });
}
