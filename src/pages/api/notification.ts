// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { env } from '../../env.mjs';
let lastReceivedState: any = { nada: 'nada' };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method;

  if (method === 'POST') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    lastReceivedState = req.body;

    // Forward the data to tRPC notification route
    try {
      const result = await axios.post(
        `${env.APP_URL}/api/trpc/order.notification`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        { json: req.body },
      );
      if (result.status === 200) {
        console.log('Data forwarded successfully to tRPC notification route');
        res
          .status(200)
          .send('Data forwarded successfully to tRPC notification route');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        lastReceivedState = req.body;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        throw new Error(result.data);
      }
    } catch (error) {
      // console.error(error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      lastReceivedState = req.body;
      res
        .status(500)
        .send(
          'Error occurred while forwarding data to tRPC notification route',
        );
    }
  }
  if (method === 'GET') {
    res.status(200).json(lastReceivedState);
  }

}
