import React from "react";
import { BadgeCheck, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetReviewsByUserQuery } from "@/graphql/hooks";
import { calculateAverageRating } from "@/utils/AverageRating";


interface TripDetailsDriverProps {
  driverName: string;
  profileImage?: string;
  driverId: string;
}

export const TripDetailsDriver: React.FC<TripDetailsDriverProps> = ({
  driverName,
  profileImage,
  driverId,
}) => {
  const navigate = useNavigate();

  const { data: reviewsData } = useGetReviewsByUserQuery({
    variables: { userId: driverId },
    skip: !driverId
  });

  const reviews = reviewsData?.getReviewsByUser || [];
  const averageRating = calculateAverageRating(reviews);
  const reviewsCount = reviews.length;

  const handleNavigateProfile = (id: string) => {
    navigate(`/user/${id}`);
  };

  return (
    <div
      onClick={() => handleNavigateProfile(driverId)}
      className="w-full sm:w-11/12 md:w-full lg:w-[480px] xl:w-[583px] bg-background cursor-pointer border-[#E5E5E5] border-1 rounded-lg px-4 md:px-6 py-6 md:py-8 mb-6 hover:opacity-85"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4">
            <img
              src={profileImage || "/placeholder-portrait.png"}
              alt={`${driverName}`}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center">
              <p className="text-base md:text-lg capitalize font-medium text-black">
                {driverName}
              </p>
            </div>
            <div className="flex items-center">
              {averageRating !== null ? (
                <>
                  <div className="flex items-center mr-2">
                    <span className="text-secondary mr-1">★</span>
                    <p className="text-sm">{averageRating.toFixed(1)}</p>
                  </div>
                  <p className="text-forecast text-xs">• {reviewsCount} avis</p>
                </>
              ) : (
                <p className="text-forecast text-xs">Pas d'avis</p>
              )}
            </div>
          </div>
        </div>
        <ChevronRight strokeWidth={1} color="black" />
      </div>
      <div className="flex items-center mt-4 ml-1 text-accent">
        <BadgeCheck size={16} />
        <p className="ml-2 text-sm">Profil vérifié</p>
      </div>
    </div>
  );
};

export default TripDetailsDriver;