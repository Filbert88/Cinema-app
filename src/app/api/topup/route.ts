// src/app/api/topup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { db } from '@/src/lib/db';

export async function POST(req: NextRequest) {
  console.log("Top-up request received");

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    console.log('Unauthorized');
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { amount } = await req.json();

  if (!amount || amount <= 0) {
    console.log('Invalid amount');
    return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
  }

  try {
    const user = await db.user.update({
      where: { id: session.user.id },
      data: {
        balance: {
          increment: amount,
        },
        transactions: {
          create: {
            amount,
            type: "topup",
          },
        },
      },
      select: { balance: true },
    });

    const balance = user.balance.toString(); 

    console.log('Top-up successful, new balance:', balance);
    return NextResponse.json({ balance: balance });
  } catch (error) {
    console.error("Error in top-up:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
