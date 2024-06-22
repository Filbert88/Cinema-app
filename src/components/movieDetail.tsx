"use client"
import React from "react";
import Popup from "@/src/components/popup";
import { Movie } from "./mainPage";

interface MovieDetailProps {
  movie: Movie;
  session: any;
}

export default function MovieDetail({ movie, session }: MovieDetailProps) {
  if (!movie) {
    return <p>Movie not found!</p>;
  }
  return (
    <div>
      <Popup movie={movie} session={session} />
    </div>
  );
}
