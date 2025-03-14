import { Trip } from "@/graphql/hooks";
import { formatDate } from "@/utils/FormatDate";
import { formatTime } from "@/utils/FormatTime";

type TripCardProps = {
  trips: Trip[];
};

export default function TripCard({ trips }: TripCardProps) {
  
  const locale: string = "fr";
  
  return (
    <section>
      <div>
        {trips.map((trip) => {
          return (
            <section
              key={trip.id}
              className="p-5 my-8 mx-6 md:mx-12 bg-gray-200 rounded-[10px]"
            >
              <div className="flex items-center mb-4">
                <p className="text-gray-600">{formatTime(trip.departure_time, locale)}</p>
              </div>
              <p className="text-lg ">{formatDate(trip.departure_time, locale)}</p>

              <h1 className="text-2xl mb-4">
                {trip.departure_city} - {trip.arrival_city}
              </h1>
              <div className="flex justify-between items-center">
                <p className="text-gray-700">{trip.driver?.firstname}</p>
                <p className="text-xl font-bold">{trip.price}€</p>
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}