import Image from "next/image";
import React from "react";
import { Card } from "../../components/card";

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function Mainpage() {

  const movies = await prisma.movie.findMany();

  console.log(movies)
  
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-white text-4xl mb-12 font-bold">Now Playing</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-16 w-fit">
      {movies.map(movie => (
          <Card key={movie.id} path={movie.poster_url} title={movie.title} desc={`${movie.age_rating}+`} />
        ))}
      </div>
    </div>
  );
};
