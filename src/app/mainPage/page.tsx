"use client"
import React, { useEffect, useState } from "react";
import { Card } from "../../components/card";
import Popup from "@/src/components/popup";
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/navigation";

const prisma = new PrismaClient();

export interface Movie {
  id: bigint;
  title: string;
  description: string;
  release_date: string;
  poster_url: string;
  age_rating: number;
  ticket_price: number;
}

export default function Mainpage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        const data = await response.json();
        setMovies(data);
        console.log("Fetched data:", data)
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };
    fetchMovies();
  }, []);

  const handleCardClick = (movie: Movie) => {
    router.push(`/movies/${movie.id}`);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-white text-4xl mb-12 font-bold">Now Playing</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-16 w-fit">
        {movies.map((movie) => (
          <Card
            key={String(movie.id)}
            path={movie.poster_url}
            title={movie.title}
            desc={`${movie.age_rating}+`}
            onClick={() => handleCardClick(movie)}
          />
        ))}
      </div>
      {selectedMovie && <Popup movie={selectedMovie} />}
    </div>
  );
}
