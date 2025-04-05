import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { operation } = req.query;

  if (operation === 'google') {
    res.redirect('https://backend.vanii.ai/auth/api/v1/user/google');
  } else if (operation === 'callback') {

    try {
      const response = await fetch('http://localhost:5000/auth/google/callback', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch callback data: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to handle callback' });
    }
  } else {
    res.status(400).json({ error: 'Invalid operation' });
  }
}
