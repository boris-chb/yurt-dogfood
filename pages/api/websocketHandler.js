import { Server } from 'socket.io';
import Cors from 'cors';

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    // Perform WebSocket handshake

    try {
    } catch (e) {
      console.error(error);
    }
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
    res.send('');
    res.status(405).end();
  }
}
