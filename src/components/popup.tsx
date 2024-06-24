import React, { useState } from "react";
import Image from "next/image";
import { Movie } from "./mainPage";
import { useRouter } from "next/navigation";
import Modal from "./modal";

interface PopupProps {
  movie: Movie;
  session: any;
}



export default function Popup({ movie, session } : PopupProps) {
  const getAdjustedDate = (offsetHours = 7) => {
    const date = new Date();
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(utc + 3600000 * offsetHours);
    return adjustedDate;
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

  const [showModal, setShowModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [tickets, setTickets] = useState("");  // Default to 1 ticket

  const ModalAmount = () => {
    if (!showModal) return null;
  
    return (
      
      <Modal
        isOpen={showModal}
        title="Ticket Amount"
        description="How many tickets do you want to buy?"
        onClose={() => setShowModal(false)}
        onConfirm={handleBuyTickets}
        confirmText="Confirm"
        inputValue={tickets}
        onInputChange={setTickets}
    />
    );
  };
  

  const router = useRouter()

  const formatDateAndTimeForUrl = (date: string, time: string) => {
    console.log('Received date:', date);
    console.log('Received time:', time);
  
    // Convert date format from "YYYY/MM/DD" to "YYYY-MM-DD"
    const normalizedDate = date.replace(/\//g, '-');
    console.log('Normalized date:', normalizedDate);
  
    const dateTimeString = `${normalizedDate}T${time}`;
    console.log('Combined dateTimeString:', dateTimeString);
  
    const dateTime = new Date(dateTimeString);
    if (isNaN(dateTime.getTime())) {
      throw new Error(`Invalid date or time: ${dateTimeString}`);
    }

    const now = new Date();
    return encodeURIComponent(dateTime.toISOString());
  };

  // untuk ngebook ticket
  const handleTimeClick = (date: string, time: string) => {
    if (session && session.user) {
      setSelectedTime(time);  // Save the selected time
      setShowModal(true);  // Open the modal
    } else {
      alert("Please sign in to book a ticket");
    }
  };

  const handleBuyTickets = () => {
    const dateTimeParam = formatDateAndTimeForUrl(formattedToday, selectedTime);
    // Here you could actually send the buy request or navigate
    const ticket_amount = parseInt(tickets);
    router.push(`/movies/${movie.id}/${dateTimeParam}/${ticket_amount}`);
    setShowModal(false);  // Close the modal
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-5 sm:p-10 bg-black mt-10">
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
                        ? "bg-gray-700 text-white border-none cursor-not-allowed"
                        : "border-[#64ffda]"
                    }`}
                    onClick={() =>
                      !isPastTime(session.date, time) && handleTimeClick(session.date, time)
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
        {session && session.user && (
          <div className="mt-4">
            <div className="font-bold text-xl sm:text-2xl">Logged in as:</div>
            <div>{session.user.name} ({session.user.email})</div>
          </div>
        )}
      </div>
      <ModalAmount/>
      
    </div>
  );
}
