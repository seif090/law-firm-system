const WebSocket = require('ws');

const port = process.env.WS_PORT ? Number(process.env.WS_PORT) : 8080;
const wss = new WebSocket.Server({ port });

wss.on('connection', (socket) => {
  console.log('WebSocket client connected');
  socket.send(JSON.stringify({ type: 'welcome', title: 'WS Connected', body: 'تم الاتصال بخادم WS' }));

  socket.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data && data.type === 'broadcast') {
        const payload = { ...data.payload, id: Date.now(), read: false };
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(payload));
          }
        });
      }
    } catch (err) {
      console.error('Invalid WS message', err);
    }
  });

  socket.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

console.log(`WebSocket server running on ws://localhost:${port}`);
