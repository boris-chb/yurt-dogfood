import { Server } from 'socket.io';
import Cors from 'cors';

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

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

  if (req.method === 'GET') {
    const server = createServer();
    const io = new Server(server);
    const port = process.env.PORT || 3000;

    io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('message', (data) => {
        console.log(`Received message from client: ${data}`);
        socket.emit('message', `Echo: ${data}`);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    server.listen(port, () => {
      console.log(`WebSocket server listening on port ${port}`);
    });

    io.attach(server);
  } else {
    res.status(404).end();
  }
}
