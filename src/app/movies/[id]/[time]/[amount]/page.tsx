
import BookingForm from "@/src/components/BookingForm";
import { authOptions } from "@/src/lib/auth";
import { Movie, PrismaClient } from "@prisma/client";
import { request } from "http";
import { getServerSession } from "next-auth";
import { notFound, useSearchParams } from "next/navigation";

const prisma = new PrismaClient();
export default async function movieBook({params} : {params : {id: string, time: string, amount: number}}) {

    const {id, time, amount} = params;

    
    
    let bigintId;
    try {
        bigintId = BigInt(id);
    } catch (error) {
        console.error("Error converting ID to BigInt:", error);
        return <p>Invalid movie ID.</p>;
    }

    const decodedDateTime = decodeURIComponent(time);
    const dateTime = new Date(decodedDateTime);

 
    const movie = await prisma.movie.findUnique({
        where: {id: bigintId}
    });

    if(!movie){
        return notFound();
    }

    

    console.log(movie)


    const seatSolds = await prisma.ticket.findMany({
        where: {
            movieId :bigintId,
            timeStart: dateTime
         },
        select: {
            seatNumber: true,
        }
    })

    const soldSeatsOnly = seatSolds.map((seat) => seat.seatNumber);
    console.log(soldSeatsOnly)
    return(
        <div className="flex flex-col justify-center items-center px-5 py-10 xl:py-16">
            <BookingForm
                id= {id}
                date = {dateTime}
                title = {movie.title}
                price = {movie.ticket_price}
                seatSoldIds = {soldSeatsOnly}
                limit = {amount}
            />
        </div>
    )
}