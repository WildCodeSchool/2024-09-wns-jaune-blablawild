import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Type qui correspond exactement à la structure GraphQL
type Passenger = {
  profile?: {
    __typename?: "Profile";
    id: string;
    image?: string | null;
    user?: {
      __typename?: "User";
      firstname: string;
    } | null;
  } | null;
};

export const TripDetailsPassenger = ({
  passengers,
}: {
  passengers?: Array<Passenger> | null;
}) => {
  const navigate = useNavigate();

  const handleNavigateProfile = (id: string) => {
    navigate(`/user/${id}`);
  };

  if (!passengers || passengers.length === 0) return null;

  return (
    <div className="bg-background w-full sm:w-11/12 md:w-full lg:w-[480px] xl:w-[583px] border-[#E5E5E5] border rounded-lg px-4 md:px-6 py-3 md:py-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {passengers.map((passenger, index) => {
          if (!passenger.profile) return null;

          return (
            <div
              onClick={() => handleNavigateProfile(passenger.profile!.id)}
              key={passenger.profile.id || index}
              className="flex items-center p-2 md:p-3 cursor-pointer"
            >
              <img
                src={passenger.profile.image || "/placeholder-portrait.png"}
                alt={passenger.profile.user?.firstname || ""}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover mr-2 md:mr-3"
              />
              <p className="text-forecast text-sm md:text-base">
                {passenger.profile.user?.firstname || ""}
              </p>
              <ChevronRight strokeWidth={1} color="black" className="ml-auto" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TripDetailsPassenger;