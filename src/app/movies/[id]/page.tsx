import { getServerSession } from "next-auth/next";
import { authOptions } from "@/src/lib/auth";
import { PrismaClient } from "@prisma/client";
import React from "react";
import MovieDetail from "@/src/components/movieDetail";

const prisma = new PrismaClient();

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const { id } = params;

  let bigintId;
  try {
    bigintId = BigInt(id);
  } catch (error) {
    console.error("Error converting ID to BigInt:", error);
    return <p>Invalid movie ID.</p>;
  }

  const movie = await prisma.movie.findUnique({
    where: { id: bigintId },
  });

  if (!movie) {
    return <p>Movie not found!</p>;
  }

  const serializedMovie = { ...movie, id: movie.id.toString() };

  return (
    <div>
      <MovieDetail movie={serializedMovie} session={session} />
    </div>
  );
}
