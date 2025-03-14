import { Trip } from "@/graphql/hooks";

type TripCardProps = {
  trips: Trip[];
};

export default function TripCard({ trips }: TripCardProps) {
  
  return (
    <section>
      <div>
        {trips.map((trip) => {
          return (
            <section
              key={trip.id}
              className="p-5 my-8 mx-6 md:mx-12 bg-gray-200 rounded-[10px]"
            >
              <p>{new Date(trip.departure_time).toLocaleString("fr-FR")}</p>
              <h1 className="text-2xl mb-4">
                {trip.departure_city} + {trip.arrival_city}
              </h1>
              <p>{trip.driver.firstname}</p>
              <p>{trip.price}€</p>
            </section>
          );
        })}
      </div>
    </section>
  );
}
