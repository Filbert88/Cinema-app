import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth";
import Mainpage from "@/src/components/mainPage";

const prisma = new PrismaClient();

export default async function MainPage() {
  const session = await getServerSession(authOptions);

  const movies = await prisma.movie.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      release_date: true,
      poster_url: true,
      age_rating: true,
      ticket_price: true,
    },
  });

  const serializedMovies = movies.map((movie) => ({
    ...movie,
    id: movie.id.toString(),
  }));

  return <Mainpage movies={serializedMovies} session={session} />;
}
