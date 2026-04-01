import { NextResponse } from 'next/server';
import { legalActivities, legalCases, legalClients } from '@/lib/legal-dashboard-data';

export async function GET(_request: Request, { params }: { params: { entity: string; id: string } }) {
  const entity = params.entity;
  const id = Number(params.id);

  if (!['case', 'client'].includes(entity)) {
    return NextResponse.json({ error: 'Entity must be case or client' }, { status: 400 });
  }

  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const found = entity === 'case'
    ? legalCases.find((item) => item.id === id)
    : legalClients.find((item) => item.id === id);

  if (!found) {
    return NextResponse.json({ error: `${entity} not found` }, { status: 404 });
  }

  const timeline = legalActivities
    .filter((activity) => activity.type === entity && activity.entityId === id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return NextResponse.json({ entity, id, timeline });
}
