// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { env } from 'process';
let lastReceivedState: any = { nada: 'nada' };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const method = req.method;

  if (method == 'GET') {
    res.status(200).json(lastReceivedState);
  }

  if (method == 'POST') {
    console.log(req.body);
    lastReceivedState = JSON.stringify(req.body);

    // Forward the data to tRPC notification route
    try {
      const response = await axios.post(
        `${env.APP_URL!}/api/trpc/order.notification}`        ,
        req.body,
      );

      if (response.status === 200) {
        console.log('Data forwarded successfully to tRPC notification route');
        res
          .status(200)
          .send('Data forwarded successfully to tRPC notification route');
      } else {
        console.error(
          'Error occurred while forwarding data to tRPC notification route',
        );
        res
          .status(500)
          .send(
            'Error occurred while forwarding data to tRPC notification route',
          );
      }
    } catch (error) {
      console.error(
        'Error occurred while forwarding data to tRPC notification route: ',
        error,
      );
      res
        .status(500)
        .send(
          'Error occurred while forwarding data to tRPC notification route',
        );
    }
  }
}
