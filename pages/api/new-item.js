export default async function handler(req, res) {
  if (req.method !== 'POST')
    return new Response('Only post requests', { status: 400 });

  const allowedUsers = ['bciobirca'];

  let body = await request.json();
  console.log(body);

  res.status(200).send({ result: 'it works bro' });
}
