import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  password: z.string().min(6, { message: 'Password must be at least 8 characters long' }),
});

export async function POST(req: Request) {
  console.log('POST request received');

  try {
    const body = await req.json();
    console.log('Request body:', body);

    const parsedBody = userSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          user: null,
          message: 'Invalid input',
          errors: parsedBody.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, username, password } = parsedBody.data;

    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      console.log('User already exists with this email');
      return NextResponse.json(
        {
          user: null,
          message: 'User already exists with this email',
        },
        { status: 409 }
      );
    }

    const existingUserByUsername = await db.user.findFirst({
      where: { name: username },
    });

    if (existingUserByUsername) {
      console.log('User already exists with this username');
      return NextResponse.json(
        {
          user: null,
          message: 'User already exists with this username',
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    const newUser = await db.user.create({
      data: {
        email,
        name: username,
        password: hashedPassword,
      },
    });

    console.log('New user created:', newUser);

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          balance: newUser.balance.toString(),
        },
        message: 'User created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/user:', error);
    return NextResponse.json(
      {
        user: null,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}