import { ShowTicket } from "@/src/components/tickets";
import { authOptions } from "@/src/lib/auth"
import { db } from "@/src/lib/db";
import { da } from "date-fns/locale";
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

export default async function myTicket(){

    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        redirect("/signin");
    }
    console.log("broo")
    const now = new Date();


    const pastTickets = await db.ticket.findMany({
        where: {
            userId: session.user.id,
            timeStart: {
                lt: now, 
            },
        },
        orderBy: {
            timeStart: 'desc', 
        },

        select : {
            movie: true,
            timeStart: true,

        }
    });

    const activeTickets = await db.ticket.findMany({
        where: {
            userId: session.user.id,
            timeStart: {
                gt: now, 
            },
        },
        orderBy: {
            timeStart: 'desc', 
        },

        select : {
            movie: true,
            timeStart: true,

        }
    });

    return (
        <ShowTicket 
            pastTickets={pastTickets}
            activeTickets={activeTickets} />
    )
}