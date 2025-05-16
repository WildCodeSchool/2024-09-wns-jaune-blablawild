import React from "react";
import { formatUTCTime } from "@/utils/FormatUTC";

interface JourneyLineProps {
  departureTime: string;
  departureCity: string;
  departureAddress: string;
  arrivalTime: string;
  arrivalCity: string;
  arrivalAddress: string;
  tripDuration: string;
}

export const TripLine: React.FC<JourneyLineProps> = ({
  departureTime,
  departureCity,
  departureAddress,
  arrivalTime,
  arrivalCity,
  arrivalAddress,
  tripDuration,
}) => {
  return (
    <div className="flex">
      <div className="flex flex-col justify-between mr-2">
        <div>
          <p className="text-forecast text-xl">
            {formatUTCTime(departureTime)}
          </p>
          <p className="text-xs text-gray-500">{tripDuration}</p>
        </div>
        <p className="text-forecast text-xl">
          {formatUTCTime(arrivalTime)}
        </p>
      </div>

      <div className="flex flex-col items-center mx-2 relative">
        <div className="w-2 h-2 rounded-full border-2 border-[#4E598C]"></div>
        <div className="w-0.5 h-24 bg-[#4E598C] my-1"></div>
        <div className="w-2 h-2 rounded-full border-2 border-[#4E598C]"></div>
      </div>

      <div className="flex flex-col justify-between ml-2">
        <div>
          <p className="text-lg text-forecast">{departureCity}</p>
          <p className="text-xs text-forecast">{departureAddress}</p>
        </div>
        <div>
          <p className="text-lg text-forecast">{arrivalCity}</p>
          <p className="text-xs text-forecast">{arrivalAddress}</p>
        </div>
      </div>
    </div>
  );
};
