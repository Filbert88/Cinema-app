import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { db } from '@/src/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ balance: Number(user.balance) });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
