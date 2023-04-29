import { Server } from 'socket.io';

export default async function websocketHandler(req, res) {
  if (req.method === 'POST') {
    // Perform WebSocket handshake
    const io = new Server();
    const socket = await new Promise((resolve) => {
      io.on('connection', (socket) => {
        resolve(socket);
      });
      io.attach(req.socket);
    });

    // Handle WebSocket messages
    socket.on('message', (message) => {
      console.log(`Received message from client: ${message}`);
      // Send a message back to the client
      socket.emit('message', `Hello, client! You said: ${message}`);
    });

    // Handle WebSocket errors
    socket.on('error', (error) => {
      console.error(`WebSocket error: ${error}`);
    });

    // Handle WebSocket close
    socket.on('close', () => {
      console.log(`WebSocket connection closed`);
    });
  } else {
    res.status(405).end();
  }
}
