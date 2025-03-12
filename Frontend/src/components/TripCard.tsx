import { useGetTripQuery } from "@/graphql/hooks";

export default function TripCard() {
  const { loading, error, data } = useGetTripQuery();

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section>
      <div>
        {data?.getTrip.map((trip) => {
          return (
            <section
              key={trip.id}
              className="p-4 m-4 bg-gray-200 rounded-[10px]"
            >
              <p>{new Date(trip.depature_time).toLocaleString("fr-FR")}</p>
              <h1 className="text-2xl mb-4">
                {trip.depature_city} + {trip.arrival_city}
              </h1>
              <p>{trip.driver.firstname}</p>
            </section>
          );
        })}
      </div>
    </section>
  );
}
