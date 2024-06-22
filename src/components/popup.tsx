import React from "react";
import Image from "next/image";
import { Movie } from "../app/mainPage/page";

interface PopupProps {
  movie: Movie;
}

export default function Popup({ movie } : PopupProps) {
  const getAdjustedDate = (offsetHours = 7) => {
    const date = new Date();
    date.setHours(date.getHours() + offsetHours);
    return date;
  };

  const parseDateString = (dateString: string, timeString: string) => {
    const [year, month, day] = dateString.split("/").map(Number);
    const [hour, minute] = timeString.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };

  const formatDate = (date: Date) => {
    let d = new Date(date),
      year = d.getFullYear(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("/");
  };

  const today = getAdjustedDate();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formattedToday = formatDate(today);
  const formattedTomorrow = formatDate(tomorrow);

  const times = ["11:00", "14:00", "18:00", "20:00"];

  const movieSchedule = [
    { date: formattedToday, times },
    { date: formattedTomorrow, times },
  ];

  const isPastTime = (date: string, time: string) => {
    const dateTime = parseDateString(date, time);
    return dateTime < new Date();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-5 sm:p-10 bg-black">
      <div className="flex flex-col w-full max-w-3xl">
        <div className="flex flex-col">
          <div className="flex flex-col gap-4 sm:hidden">
            <div className="flex flex-row space-x-4">
              <div className="border border-red rounded-lg p-3 w-fit text-center flex items-center">
                {`${movie.age_rating}+`}
              </div>
              <div className="text-2xl sm:text-3xl font-bold flex items-center">
                {movie.title}
              </div>
            </div>
            <div>
              <div className="relative w-[240px] mb-4 flex flex-row justify-center">
                <Image
                  className="aspect-[2/3] w-full rounded-xl justify-center"
                  src={movie.poster_url}
                  alt={movie.title}
                  height={400}
                  width={450}
                  objectFit="cover"
                />
              </div>
              <div className="border border-red rounded-lg p-3 w-fit mb-6">
                <div className="flex flex-row gap-1">
                  <div>Rp</div>
                  <div>{movie.ticket_price}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="sm:flex sm:flex-row gap-4 hidden">
            <div className="relative w-[250px] mb-4">
              <Image
                className="aspect-[2/3] w-full rounded-xl"
                src={movie.poster_url}
                alt={movie.title}
                height={375}
                width={250}
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <div className="text-3xl font-bold">{movie.title}</div>
              <div className="flex flex-row gap-4">
                <div className="border border-red rounded-lg p-3 w-fit">{`${movie.age_rating}+`}</div>
                <div className="border border-red rounded-lg p-3 w-fit">
                  <div className="flex flex-row gap-1">
                    <div>Rp</div>
                    <div>{movie.ticket_price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {movieSchedule.map((session) => (
            <div key={session.date} className="flex flex-col space-y-2 mb-3">
              <div className="flex flex-row space-x-1 font-bold text-xl sm:text-2xl">
                <div>{session.date}</div>
                <div>&#10088; {session.date === formattedToday ? "Today" : "Tomorrow"} &#10089;</div>
              </div>
              <button className="flex flex-row gap-2">
                {session.times.map((time) => (
                  <div
                    key={time}
                    className={`border p-3 rounded-lg w-fit ${
                      isPastTime(session.date, time)
                        ? "bg-gray-500 text-white cursor-not-allowed"
                        : "border-red"
                    }`}
                    onClick={() =>
                      !isPastTime(session.date, time)
                    }
                  >
                    {time}
                  </div>
                ))}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="font-bold text-xl sm:text-2xl">Release date</div>
          <div>{movie.release_date}</div>
        </div>
        <div className="mt-4">
          <div className="font-bold text-xl sm:text-2xl">Description</div>
          <div className="text-justify font-normal">{movie.description}</div>
        </div>
      </div>
    </div>
  );
}