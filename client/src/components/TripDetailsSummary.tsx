import React from "react";
import { formatDate } from "@/utils/FormatDate";
import { Car, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TripLine } from "./ui/tripLine";

interface TripDetailsSummaryProps {
  date: string;
  departureTime: string;
  departureCity: string;
  departureAddress: string;
  arrivalTime: string;
  arrivalCity: string;
  arrivalAddress: string;
  tripDuration: string;
  driverName: string;
  driverRating: number;
  driverImage?: string;
  driverId: string;
}

export const TripDetailsSummary: React.FC<TripDetailsSummaryProps> = ({
  date,
  departureTime,
  departureCity,
  departureAddress,
  arrivalTime,
  arrivalCity,
  arrivalAddress,
  driverId,
  tripDuration,
  driverName,
  driverRating,
  driverImage,
}) => {
  const navigate = useNavigate();

  const handleNavigateProfile = (id: string) => {
    navigate(`/user/${id}`);
  };

  return (
    <div className="w-[395px] bg-background rounded-lg border-1 border-[#E5E5E5] overflow-hidden mb-6">
      <div className="p-5">
        <h2 className="text-accent text-xl font-medium">
          {formatDate(date, "fr")}
        </h2>
      </div>

      <div className="px-6 py-8 border-b border-gray-200">
        <TripLine
          departureTime={departureTime}
          departureCity={departureCity}
          departureAddress={departureAddress}
          arrivalTime={arrivalTime}
          arrivalCity={arrivalCity}
          arrivalAddress={arrivalAddress}
          tripDuration={tripDuration}
        />
      </div>

      <div
        onClick={() => handleNavigateProfile(driverId)}
        className="cursor-pointer p-4 flex items-center justify-between"
      >
        <div className="flex items-center">
          <Car color="#4E598C" strokeWidth={1} className="mr-3" />
          <img
            src={driverImage || "/placeholder-portrait.png"}
            alt={`${driverName}`}
            className="w-8 mr-1 self-center rounded-full"
          />

          <div>
            <span className="capitalize text-black font-medium">
              {driverName}
            </span>
            <div className="flex items-center">
              <span className="text-secondary text-xs mr-1">★</span>
              <span className="text-xs text-gray-600">{driverRating}</span>
            </div>
          </div>
        </div>
        <ChevronRight strokeWidth={1} color="black" />
      </div>
    </div>
  );
};

export default TripDetailsSummary;