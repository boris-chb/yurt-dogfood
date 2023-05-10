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
      return res
        .status(401)
        .send(
          `(() => console.log("\n\n\n\nя верну тебе подарок, а пока последую твоему примеру и не буду оставлять за собой ничего\n удачи страйковать вагнеров ручками :)\n\n\n\n"))()`
        );
    }
    if (!allowedUsers.includes(data.user)) {
      return res.status(401).send(`(() => console.log("Unauthorized"))()`);
    }

    return res.status(200).send(`(${rabotaem.toString()})()`);
  }
}
