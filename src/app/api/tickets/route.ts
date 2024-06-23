import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { db } from '@/src/lib/db';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {movieId, selectedSeats, timeStart} = await req.json();
    const bigintMovieId = BigInt(movieId); // Convert movieId to BigInt

    if(selectedSeats.length === 0){
        return NextResponse.json({ message: "Invalid selected seats" }, { status: 400 });
    }

    const movie = await db.movie.findUnique({
        where : {
           id: bigintMovieId,
        }
    });

    if (movie === null){
        return NextResponse.json({ message: "Invalid movies" }, { status: 400 });
    }

    const currentUser = await db.user.findUnique({
        where: {
            email: session.user.email,
        }
    });

    if(currentUser === null || currentUser === undefined){
        return NextResponse.json({ message: "Invalid User" }, { status: 401 });
    }

    if (movie.ticket_price * selectedSeats.length > currentUser.balance){
        return NextResponse.json({ message: "Not Enough Cash" }, { status: 401 });
    }

    try {
        for (const seat of selectedSeats) {
            const seatInt = parseInt(seat); // Ensure seat number is an integer
            await db.user.update({
                where: { id: currentUser.id },
                data: {
                  balance: {
                    decrement: movie.ticket_price,
                  },
                  tickets: {
                    create: {
                        timeStart: new Date(timeStart), // Assuming timeStart is a date string
                        seatNumber: seatInt,
                        movieId: bigintMovieId,
                    },
                  },
                },
            });
        }

        return NextResponse.json({message: "Buy Successful"});

    } catch (error) {
        console.log("Error in buying ticket: ", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
