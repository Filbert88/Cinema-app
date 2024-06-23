import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { db } from '@/src/lib/db';

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { amount } = await req.json();

  if (!amount || amount <= 0) {
    return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({ where: { id: session.user.id } });

    if (!user || user.balance < amount) {
      return NextResponse.json({ message: "Insufficient Balance" }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        balance: {
          decrement: amount,
        },
        transactions: {
          create: {
            amount,
            type: 'withdraw',
          },
        },
      },
    });

    const balance = updatedUser.balance.toString();
    return NextResponse.json({ balance: balance });
  } catch (error) {
    console.error('Error in withdraw:', error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
