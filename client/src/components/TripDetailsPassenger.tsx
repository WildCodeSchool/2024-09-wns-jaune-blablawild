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
    <div className="bg-gray-100 border-[#E5E5E5] border rounded-lg px-6 py-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        {passengers.map((passenger, index) => {
          if (!passenger.profile) return null;

          return (
            <div
              onClick={() => handleNavigateProfile(passenger.profile!.id)}
              key={passenger.profile.id || index}
              className="flex items-center p-3 cursor-pointer"
            >
              <img
                src={passenger.profile.image || "/placeholder-portrait.png"}
                alt={passenger.profile.user?.firstname || ""}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <span className="text-forecast">
                {passenger.profile.user?.firstname || ""}
              </span>
              <div className="ml-auto text-black">
                <ChevronRight />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TripDetailsPassenger;
