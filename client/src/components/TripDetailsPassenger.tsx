import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Booking = {
  id: string;
  seatsCount: number;
  passenger: {
    id: string;
    firstname: string;
    profile?: {
      image?: string | null;
    } | null;
  };
};

type Trip = {
  bookings?: Array<Booking> | null;
};

export const TripDetailsPassenger = ({
  trip,
}: {
  trip?: Trip | null;
}) => {
  const navigate = useNavigate();

  const handleNavigateProfile = (id: string) => {
    navigate(`/user/${id}`);
  };

  if (!trip?.bookings || trip.bookings.length === 0) return null;

  return (
    <div className="bg-background w-full sm:w-11/12 md:w-full lg:w-[480px] xl:w-[583px] border-[#E5E5E5] border rounded-lg px-4 md:px-6 py-3 md:py-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {trip.bookings.map((booking, index) => {
          return (
            <div
              onClick={() => handleNavigateProfile(booking.passenger.id)}
              key={booking.id || index}
              className="flex items-center p-2 md:p-3 cursor-pointer hover:opacity-80"
            >
              <img
                src={booking.passenger?.profile?.image || "/placeholder-portrait.png"}
                alt={booking.passenger.firstname || ""}
                className="w-6 h-6 md:w-10 md:h-10 rounded-full object-cover mr-2 md:mr-3"
              />
              <div className="flex flex-col">
                <p className="text-forecast text-sm capitalize md:text-base">
                  {booking.passenger.firstname || ""}
                </p>
                <p className="text-xs text-gray-500">
                  {booking.seatsCount} siège{booking.seatsCount > 1 ? 's' : ''}
                </p>
              </div>
              <ChevronRight strokeWidth={1} color="black" className="ml-auto" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TripDetailsPassenger;