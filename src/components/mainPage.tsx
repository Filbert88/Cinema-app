"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Popup from "@/src/components/popup";
import { Card } from "@/src/components/card";

export interface Movie {
  id: string;
  title: string;
  description: string;
  release_date: string;
  poster_url: string;
  age_rating: number;
  ticket_price: number;
}

interface MainpageProps {
  movies: Movie[];
  session: any;
}

export default function Mainpage({ movies, session }: MainpageProps) {
  "use client";
  const router = useRouter();
  const { data: clientSession, status } = useSession();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleCardClick = (movie: Movie) => {
    const userId =
      clientSession && clientSession.user
        ? clientSession.user.id
        : session.user.id;
    router.push(`/movies/${movie.id}?user=${userId}`);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-white text-4xl mb-12 font-bold">Now Playing</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-16 w-fit">
        {movies.map((movie) => (
          <Card
            key={movie.id}
            path={movie.poster_url}
            title={movie.title}
            desc={`${movie.age_rating}+`}
            onClick={() => handleCardClick(movie)}
          />
        ))}
      </div>
      {/* {selectedMovie && <Popup movie={selectedMovie} session={session} />} */}
    </div>
  );
}
