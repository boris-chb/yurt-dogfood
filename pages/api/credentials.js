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

export default function handler(req, res) {
  await cors(req, res);

  jsonParser(req, res, async () => {
    if (req.method === 'POST') {
      const allowedUsers = ['bciobirca'];
      const data = req.body;
      console.log(data);

      res.status(200).json({ message: 'POST success' });
    }

    if (req.method === 'GET') {
      res.status(200).json({ allowed: true });
    }
  });
}
