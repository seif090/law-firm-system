import { legalNotifications } from '@/lib/legal-dashboard-data';

const getRandomNotification = () => {
  const id = Date.now();
  const base = legalNotifications[Math.floor(Math.random() * legalNotifications.length)];
  return {
    id,
    title: base.title,
    body: base.body + ' (تحديث مباشر)',
    read: false,
    url: base.url,
  };
};

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (payload: Record<string, unknown>) => {
        const eventString = `event: message\ndata: ${JSON.stringify(payload)}\n\n`;
        controller.enqueue(encoder.encode(eventString));
      };

      // Send a heartbeat every 15s to keep connection alive.
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode('event: heartbeat\ndata: ping\n\n'));
      }, 15000);

      // Send an actual notification every 30s
      const notifier = setInterval(() => {
        const payload = getRandomNotification();
        sendEvent(payload);
      }, 30000);

      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        clearInterval(notifier);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
