import { authOptions } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { getServerSession } from "next-auth/next";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("halodadad")

    const now = new Date();

    try {
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

        return res.json(
            {
                pastTickets: pastTickets,
                activeTickets : activeTickets,
            }
        )
    }catch(error){
        return res.json({message: "Internal Server Error", status: 404});
    }
}