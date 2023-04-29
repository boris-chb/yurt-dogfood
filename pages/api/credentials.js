import Cors from 'cors';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

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

  if (req.method !== 'POST')
    return new Response('Only post requests', { status: 400 });

  const allowedUsers = ['bciobirca'];

  let body = await request.json();
  console.log(body);

  res.status(200).send({ result: 'it works bro' });
}
