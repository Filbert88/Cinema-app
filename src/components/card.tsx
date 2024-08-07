import React from "react";
import Image from "next/image";

type CardProps = {
  path: string;
  title: string;
  desc: string;
  onClick: () => void; 
};

export const Card: React.FC<CardProps> = ({ path, title, desc, onClick }) => {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <div className="flex flex-col items-center">
        <div className="w-[250px]">
          <Image 
            className="aspect-[2/3] w-full rounded-xl" 
            src={path} 
            alt={title} 
            height={375} 
            width={250} 
            objectFit="cover" 
          />
        </div>
      </div>
      <div className="p-4 text-center">
        <h2 className="text-white text-lg">{title}</h2>
        <p className="text-gray-400">{desc}</p>
      </div>
    </div>
  );
};
