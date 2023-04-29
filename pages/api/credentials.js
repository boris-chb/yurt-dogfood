import bodyParser from 'body-parser';
import Cors from 'cors';

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  Cors({
    methods: ['POST', 'OPTIONS'], // Allow only POST and OPTIONS requests
  })
);

const jsonParser = bodyParser.json();

export default async function handler(req, res) {
  await cors(req, res);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  jsonParser(req, res, async () => {
    if (req.method === 'POST') {
      const allowedUsers = ['bciobirca'];

      console.log(req.body);
      console.log(typeof req.body);
      console.log(req.body.user);
      return res.status(200);
      // const data = JSON.parse(req.body);
      // console.log(data);

      // if (!allowedUsers.includes(data.user)) {
      //   return res.status(401).json({ allowed: false });
      // }

      // return res.status(200).json({ allowed: true });
    }

    if (req.method === 'GET') {
      res.status(200).json({ allowed: true });
    }
  });

  return new Response('all good', { status: 200 });
}
