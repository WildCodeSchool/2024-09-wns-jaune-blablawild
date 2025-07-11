import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound, Users } from "lucide-react";
import { PassengersListProps } from "../_types/types";

interface Booking {
  id: string;
  seatsCount: number;
  passenger: {
    id: string;
    firstname: string;
    lastname?: string;
    profile?: {
      image?: string | null;
    } | null;
  };
}

interface PassengersListProps {
  bookings?: Booking[] | null;
}

export function PassengersList({ bookings }: Readonly<PassengersListProps>) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Users className="w-5 h-5" />
        <span className="text-sm">Aucun passager</span>
      </div>
    );
  }

  const totalSeats = bookings.reduce((sum, booking) => sum + booking.seatsCount, 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-gray-600">
        <Users className="w-5 h-5" />
        <span className="text-sm">
          Passagers ({totalSeats} siège{totalSeats > 1 ? 's' : ''}) :
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={booking.passenger.profile?.image || undefined}
                alt={booking.passenger.firstname}
              />
              <AvatarFallback><CircleUserRound size={30} strokeWidth={1.5} /></AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">
              {booking.passenger.firstname} {booking.passenger.lastname}
              {booking.seatsCount > 1 && (
                <span className="text-xs text-gray-500 ml-1">
                  ({booking.seatsCount} sièges)
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}