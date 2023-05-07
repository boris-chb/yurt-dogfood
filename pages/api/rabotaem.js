import rabotaem from '@/utils/rabotaem';
import Cors from 'cors';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

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
