import React from "react";
import Popup from "@/src/components/popup";
import { PrismaClient } from "@prisma/client";
import { GetServerSideProps } from "next";
import { Movie } from "@/src/app/mainPage/page";

interface MovieDetailProps {
    movie: Movie;
}

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;
  if (!id || typeof id !== "string") {
    return { notFound: true };
  }

  let bigintId;
  try {
    bigintId = BigInt(id);
  } catch (error) {
    console.error("Error converting ID to BigInt:", error);
    return { notFound: true };
  }

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: bigintId },
    });

    if (!movie) {
      return { notFound: true };
    }

    return { props: { movie: { ...movie, id: movie.id.toString() } } };
  } catch (error) {
    console.error("Failed to fetch movie:", error);
    return { notFound: true };
  }
};

const MovieDetail = ({ movie }: MovieDetailProps) => {
  if (!movie) {
    return <p>Movie not found!</p>;
  }
  return (
    <div>
      <Popup movie={movie} />
    </div>
  );
};

export default MovieDetail;
