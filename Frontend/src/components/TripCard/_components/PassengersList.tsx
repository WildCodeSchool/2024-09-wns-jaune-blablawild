import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { PassengersListProps } from "../_types/types";

export function PassengersList({ passengers }: Readonly<PassengersListProps>) {
  if (!passengers || passengers.length === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Users className="w-5 h-5" />
        <span className="text-sm">Aucun passager</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-gray-600">
        <Users className="w-5 h-5" />
        <span className="text-sm">Passagers :</span>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {passengers.map((passenger) => (
          <div key={passenger.id} className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={passenger.image || undefined}
                alt={passenger.firstname}
              />
              <AvatarFallback>{passenger.firstname.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">
              {passenger.firstname} {passenger.lastname}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
