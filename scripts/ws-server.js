import { Server } from 'socket.io';

const port = process.env.WS_PORT ? Number(process.env.WS_PORT) : 8080;
const io = new Server(port, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.query.token || socket.handshake.auth.token;
  if (!token || token !== 'local-token') {
    return next(new Error('Unauthorized'));
  }
  next();
});

io.on('connection', (socket) => {
  console.log('Socket.IO client connected', socket.id);
  socket.emit('welcome', { title: 'WS Connected', body: 'تم الاتصال بخادم Socket.IO' });

  socket.on('broadcast', (payload) => {
    const message = { ...payload, id: Date.now(), read: false };
    io.emit('notification', message);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket.IO client disconnected', socket.id, reason);
  });
});

console.log(`Socket.IO server running on ws://localhost:${port}`);
