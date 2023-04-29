import cors from 'cors';

// Set up CORS middleware
const corsMiddleware = cors({
  origin: '*', // Allow any origin to access the resource
  methods: ['POST', 'GET'], // Allow only POST requests
});

export default function handler(req, res) {
  corsMiddleware(req, res, async () => {
    if (req.method === 'POST') {
      const allowedUsers = ['bciobirca'];
      let body = await req.json();
      console.log(body);

      res.status(200).json({ message: 'POST success' });
    }

    if (req.method === 'GET') {
      res.status(200).json({ allowed: true });
    }
  });
}
