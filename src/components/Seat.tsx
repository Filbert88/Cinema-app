import Image from "next/image";

interface SeatProps {
    seatNumber : number;
    sold: boolean;
    selectedSeats: number[];
    setSelectedSeats: (selectedSeats: number[]) => void;
    limit: number;
}

export default function Seat({seatNumber, sold, selectedSeats, setSelectedSeats, limit }: SeatProps) {

    const seatImageSrc = sold ? '/redseat.png' : selectedSeats.includes(seatNumber) ? '/greenseat.png' : '/blackseat.png';

    const toggleSeatSelection = () => {
        if (sold) return; 
        if (selectedSeats.length >= limit && !selectedSeats.includes(seatNumber)) {
            alert('Limit reached'); 
            return;
        }
        const newSelectedSeats = selectedSeats.includes(seatNumber)
            ? selectedSeats.filter(s => s !== seatNumber) 
            : [...selectedSeats, seatNumber]; 
        setSelectedSeats(newSelectedSeats);
    };

    return (
        <div onClick={toggleSeatSelection}>
            <Image src={seatImageSrc} alt="seat" className="bg-white cursor-pointer" width={35} height={35} />
        </div>
    );
}