// "use client"
// import React, { useState } from "react";
// import { PrismaClient } from "@prisma/client";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/src/lib/auth";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import Popup from "@/src/components/popup";
// import { Card } from "@/src/components/card";

// const prisma = new PrismaClient();

// export default async function Page() {
//   const session = await getServerSession(authOptions);

//   const movies = await prisma.movie.findMany({
//     select: {
//       id: true,
//       title: true,
//       description: true,
//       release_date: true,
//       poster_url: true,
//       age_rating: true,
//       ticket_price: true,
//     },
//   });

//   const serializedMovies = movies.map((movie) => ({
//     ...movie,
//     id: movie.id.toString(),
//   }));

//   return <Mainpage movies={serializedMovies} session={session} />;
// }

// function Mainpage({ movies, session }: { movies: Movie[], session: any }) {
//   "use client";

//   const router = useRouter();
//   const { data: clientSession, status } = useSession();
//   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

//   const handleCardClick = (movie: Movie) => {
//     const userId = (clientSession && clientSession.user) ? clientSession.user.id : session.user.id;
//     router.push(`/movies/${movie.id}?user=${userId}`);
//   };

//   if (status === "loading") {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex flex-col items-center">
//       <h1 className="text-white text-4xl mb-12 font-bold">Now Playing</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-16 w-fit">
//         {movies.map((movie) => (
//           <Card
//             key={movie.id}
//             path={movie.poster_url}
//             title={movie.title}
//             desc={`${movie.age_rating}+`}
//             onClick={() => handleCardClick(movie)}
//           />
//         ))}
//       </div>
//       {selectedMovie && <Popup movie={selectedMovie} session={session} />}
//     </div>
//   );
// }

// export interface Movie {
//   id: string;
//   title: string;
//   description: string;
//   release_date: string;
//   poster_url: string;
//   age_rating: number;
//   ticket_price: number;
// }

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
