import { NextResponse } from 'next/server';
import WebSocket from 'ws';

const WS_URL = process.env.WS_URL || 'ws://localhost:8080';

export async function POST(request: Request) {
  try {
    const auth = request.headers.get('authorization');

    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Simple token check placeholder (adjust to real authentication)
    const token = auth.replace('Bearer ', '');
    if (token !== 'local-token') {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.json();
    const payload = {
      title: data.title || 'تنبيه جديد',
      body: data.body || '',
      url: data.url || '/cases',
      severity: data.severity || 'info',
    };

    const ws = new WebSocket(WS_URL);

    await new Promise<void>((resolve, reject) => {
      ws.on('open', () => {
        ws.send(JSON.stringify({ type: 'broadcast', payload }));
        ws.close();
        resolve();
      });
      ws.on('error', (err) => reject(err));
    });

    return NextResponse.json({ ok: true, message: 'Broadcast notification sent.' });
  } catch (error) {
    console.error('Broadcast error', error);
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
