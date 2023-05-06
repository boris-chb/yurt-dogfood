import rabotaem from '@/utils/rabotaem';
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
    const allowedUsers = [
      'bciobirca',
      'medvedicyna',
      'rmamaliga',
      'boykon',
      'dudnik',
      'andrisv',
      'stasenco',
      'alekasnder',
      'mihaylovt',
      'violettarose',
      'klimvitaly',
      'barabanchuk',
      'georgijs',
      'panych',
      'rozentale',
    ];

    res.setHeader('Content-Type', 'application/javascript');

    const data = req.body;

    if (!allowedUsers.includes(data.user)) {
      return res.status(401).send(`(() => console.log("Unauthorized"))()`);
    }

    return res.status(200).send(`(${rabotaem.toString()})()`);
  }
}
