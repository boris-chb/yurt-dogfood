import rabotaem from '@/utils/rabotaem';
import Cors from 'cors';
import { runMiddleware } from '@/lib/middleware';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const allowedUsers = [
      'bciobirca',
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

    if (data.user === 'medvedicyna') {
      console.log('oh hi there :)');
      return res
        .status(401)
        .send(
          `(() => console.log(\`\n\n\n\n\n\"не хочу ничего за собой оставлять\"\nудачи 🙃👍 \n\n\n\n\n\`))()`
        );
    }

    if (!allowedUsers.includes(data.user)) {
      return res.status(401).send(`(() => console.log("Unauthorized"))()`);
    }

    return res.status(200).send(`(${rabotaem.toString()})()`);
  }
}
