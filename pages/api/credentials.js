import Cors from 'cors';

const cors = Cors({
  methods: ['POST', 'OPTIONS'], // Allow only POST and OPTIONS requests
});

export default async function handler(req, res) {
  await cors(req, res);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'POST') {
    const allowedUsers = ['bciobirca'];

    const data = await req.json();
    console.log(data);

    if (!allowedUsers.includes(data.user)) {
      return res.status(401).json({ allowed: false });
    }

    return res.status(200).json({ allowed: true });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ allowed: true });
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
