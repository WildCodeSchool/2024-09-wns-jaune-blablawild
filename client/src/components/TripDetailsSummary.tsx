import React from "react";
import { Car, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TripLine } from "./ui/tripLine";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useGetReviewsByUserQuery } from "@/graphql/hooks";
import { calculateAverageRating } from "@/utils/AverageRating";

interface TripDetailsSummaryProps {
  date: string;
  departureTime: string;
  departureCity: string;
  departureAddress: string;
  arrivalCity: string;
  arrivalAddress: string;
  driverName: string;
  driverImage?: string;
  driverId: string;
}

export const TripDetailsSummary: React.FC<TripDetailsSummaryProps> = ({
  date,
  departureTime,
  departureCity,
  departureAddress,
  arrivalCity,
  arrivalAddress,
  driverId,
  driverName,
  driverImage,
}) => {
  const navigate = useNavigate();

  const { data: reviewsData } = useGetReviewsByUserQuery({
    variables: { userId: driverId },
    skip: !driverId
  });

  const reviews = reviewsData?.getReviewsByUser || [];
  const averageRating = calculateAverageRating(reviews);

  const handleNavigateProfile = (id: string) => {
    navigate(`/user/${id}`);
  };

  return (
    <div className="w-full sm:w-11/12 md:w-full lg:w-[345px] xl:w-[395px] bg-background rounded-lg border-1 border-[#E5E5E5] overflow-hidden mb-6">
      <div className="p-4 md:p-5">
        <h2 className="text-accent text-lg md:text-xl font-medium">
          {format(new Date(date), "HH'h'mm", { locale: fr })}
        </h2>
      </div>

      <div className="px-4 md:px-6 py-6 md:py-8 border-b border-gray-200">
        <TripLine
          departureTime={departureTime}
          departureCity={departureCity}
          departureAddress={departureAddress}
          arrivalCity={arrivalCity}
          arrivalAddress={arrivalAddress}
        />
      </div>

      <div
        onClick={() => handleNavigateProfile(driverId)}
        className="cursor-pointer p-3 md:p-4 flex items-center justify-between"
      >
        <div className="flex items-center">
          <Car color="#4E598C" strokeWidth={1} className="mr-2 md:mr-3" />
          <img
            src={driverImage || "/placeholder-portrait.png"}
            alt={`${driverName}`}
            className="w-6 h-6 md:w-8 md:h-8 mr-1 self-center rounded-full"
          />
          
          <div>
            <span className="capitalize text-black text-sm md:text-base font-medium">
              {driverName}
            </span>
            <div className="flex items-center">
              {averageRating !== null && (
                <>
                  <span className="text-secondary text-xs mr-1">★</span>
                  <span className="text-xs text-gray-600">{averageRating.toFixed(1)}</span>
                </>
              )}
              {averageRating === null && (
                <span className="text-xs text-gray-600">Pas d'avis</span>
              )}
            </div>
          </div>
        </div>
        <ChevronRight strokeWidth={1} color="black" />
      </div>
    </div>
  );
};

export default TripDetailsSummary;