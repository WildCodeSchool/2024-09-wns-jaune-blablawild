import React from "react";
import { BadgeCheck, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TripDetailsDriverProps {
  driverName: string;
  driverRating: number;
  driverReview: string;
  profileImage?: string;
  driverId: string;
}

export const TripDetailsDriver: React.FC<TripDetailsDriverProps> = ({
  driverName,
  driverRating,
  driverReview,
  profileImage,
  driverId,
}) => {
  const navigate = useNavigate();
  const handleNavigateProfile = (id: string) => {
    navigate(`/user/${id}`);
  };

  return (
    <div
      onClick={() => handleNavigateProfile(driverId)}
      className="w-[583px] bg-background cursor-pointer border-[#E5E5E5] border-1 rounded-lg px-6 py-8 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-4">
            <img
              src={profileImage || "/placeholder-portrait.png"}
              alt={`${driverName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center">
              <p className="text-lg capitalize font-medium text-black">
                {driverName}
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                <span className="text-secondary mr-1">★</span>
                <p className="text-sm">{driverRating}</p>
              </div>
              <p className="text-forecast text-xs">• {driverReview}</p>
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
