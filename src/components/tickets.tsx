"use client";
import React, { useState } from 'react';

interface Movie {
  id: BigInt;
  title: string;
  description: string;
  release_date: string;
  poster_url: string;
  age_rating: number;
  ticket_price: number;
}

interface TicketProps {
  movie: Movie;
  timeStart: Date;
}

interface ShowTicketsProps {
  pastTickets: TicketProps[];
  activeTickets: TicketProps[];
}

export function ShowTicket({ pastTickets, activeTickets }: ShowTicketsProps) {
  const [showPastTickets, setShowPastTickets] = useState(false);

  const ticketsToShow = showPastTickets ? pastTickets : activeTickets;
  const statusText = showPastTickets ? "Watched" : "Active";

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-center text-red text-3xl font-bold xl:text-4xl">
        My Tickets
      </h1>
      <div className="flex flex-row mb-10 mt-10 text-black">
        <button onClick={() => setShowPastTickets(false)} className={`px-5 py-3 text-2xl font-bold ${!showPastTickets ? 'bg-red text-white' : 'bg-gray-200'}`}>Active</button>
        <button onClick={() => setShowPastTickets(true)} className={`px-5 py-3 text-2xl font-bold ${showPastTickets ? 'bg-red text-white' : 'bg-gray-200'}`}>Past</button>
      </div>
      <div className="w-1/2 flex flex-col gap-10 items-center">
          {ticketsToShow.map(ticket => (
            <div key={ticket.movie.id.toString()} className="grid grid-cols-4 gap-4 text-white items-center justify-center border-b-2 border-b-white shadow-lg p-4">
              <div className="flex flex-col items-center justify-center">
                <img src={ticket.movie.poster_url} alt={ticket.movie.title} style={{ width: '100px', height: '150px' }} />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-lg text-center font-semibold">{ticket.movie.title}</h3>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className='text-center'>{ticket.timeStart.toLocaleDateString()} {ticket.timeStart.toLocaleTimeString()}</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className={`px-3 py-1 w-16 flex items-center justify-center text-center rounded-3xl text-white ${showPastTickets ? 'bg-gray-500' : 'bg-green-500'}`}>
                  {statusText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

  );
}
