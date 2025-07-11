import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface JourneyLineProps {
  departureTime: string;
  departureCity: string;
  departureAddress: string;
  arrivalCity: string;
  arrivalAddress: string;
}

export const TripLine: React.FC<JourneyLineProps> = ({
  departureTime,
  departureCity,
  departureAddress,
  arrivalCity,
  arrivalAddress,
}) => {
  return (
    <div className="flex">
      <div className="flex flex-col justify-between mr-2">
        <div>
          <p className="text-forecast text-xl">
            {format(new Date(departureTime), "HH'h'mm", { locale: fr })}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center mx-2 relative">
        <div className="w-2 h-2 rounded-full border-2 border-[#4E598C]"></div>
        <div className="w-0.5 h-24 bg-[#4E598C] my-1"></div>
        <div className="w-2 h-2 rounded-full border-2 border-[#4E598C]"></div>
      </div>

      <div className="flex flex-col justify-between ml-2">
        <div>
          <p className="text-lg text-forecast">{departureCity}</p>
          <p className="text-sm text-gray-600">{departureAddress}</p>
        </div>
        <div>
          <p className="text-lg text-forecast">{arrivalCity}</p>
          <p className="text-sm text-gray-600">{arrivalAddress}</p>
        </div>
      </div>
    </div>
  );
};