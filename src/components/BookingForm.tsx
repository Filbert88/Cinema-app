"use client";

import Image from "next/image";
import Seat from "./Seat";
import { Movie } from "./mainPage";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { POST } from "../app/api/topup/route";

interface BookingFormProps {
    id: string; 
    date: Date;
    title: string; 
    price: number; 
    seatSoldIds: number[]; 
    limit: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ id, date, title, price, seatSoldIds, limit }) => {
    const [selectedSeats, setSelectedSeats] = useState<Array<number>>([]);
    const router = useRouter();
    const formattedDate = date.toLocaleString('en-US', {
        weekday: 'long', 
        year: 'numeric', 
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit', 
        hour12: true 
      });

    const handleBuy = async ()=> {
        if(selectedSeats.length === 0){
            alert("Please select seat first");
            return;
        }

        if(selectedSeats.length != limit){
            alert("You haven't choose all your seat");
            return;
        }

        try {
            const response = await fetch('/api/tickets',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        movieId : id,
                        selectedSeats: selectedSeats,
                        timeStart: date
                    }
                )
            });

            const data = await response.json();

            if(response.ok){
                alert('Buy succesfull');
                router.push(`/movies/${id}`);
            }else {
                alert(data.message || "Buy Ticket Failed");
              }

        }catch(error){
            console.log("Buy Ticket Error: ", error);
            alert('Buy Ticket failed');
        }
    }

    const handleCancel = () => {
        router.push(`/movies/${id}`);
    }
    return(
        <div className="flex flex-col py-20 gap-10">
            <div className="flex flex-row gap-6">
                <div className="flex flex-row items-center gap-3 ">
                    <Image
                        src="/blackseat.png"
                        alt="available seat"
                        width={35}
                        height={35}
                        className="bg-white"
                        ></Image>

                    Available
                </div>
                <div className="flex flex-row items-center gap-3 ">
                    <Image
                        src="/greenseat.png"
                        alt="available seat"
                        width={35}
                        height={35}
                        className="bg-white"
                        ></Image>

                    Selected
                </div>
                <div className="flex flex-row items-center gap-3 ">
                    <Image
                        src="/redseat.png"
                        alt="available seat"
                        width={35}
                        height={35}
                        className="bg-white"
                        ></Image>

                    Sold
                </div>
            </div>

            <div className="flex flex-col gap-3 text-white" >
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-xl">Seats: {selectedSeats.length !== 0 ? selectedSeats.join(", ") : "-"}</p>
                <p className="text-xl">Tickets: {selectedSeats.length}/{limit}</p>
                <p className="text-xl">Date: {formattedDate}</p>
                <p className="text-xl">Total Payment: {selectedSeats.length * price}</p>
            </div>

            <div className="w-full flex flex-col items-center justify-center gap-6">
                <div className="grid w-fit grid-cols-8 gap-3 xl:gap-4">
                    {Array.from({ length: 64 }, (_, index) => {
                        return (
                            <Seat 
                                key={index}
                                seatNumber={index + 1}
                                sold = {seatSoldIds.includes(index+1)}
                                selectedSeats = {selectedSeats}
                                setSelectedSeats = {setSelectedSeats}
                                limit={limit}
                                ></Seat>
                        );
                    })}
                </div>
                <p className="text-2xl font-bold xl:text-3xl">SCREEN</p>
            </div>

            <div className="flex flex-row gap-10 w-full items-center justify-center">
                <button className="px-5 py-3 border-2 border-red rounded-2xl text-white hover:bg-black hover:bg-opacity-50 " onClick={handleCancel}>Cancel</button>
                <button className="px-5 py-3 border-2 border-red rounded-2xl text-white hover:bg-red hover:bg-opacity-50" onClick={handleBuy}>Buy</button>
            </div>
        </div>
    )
}

export default BookingForm;