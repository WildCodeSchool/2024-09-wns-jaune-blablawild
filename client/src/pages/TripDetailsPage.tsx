import { useGetTripByIdQuery } from "@/graphql/hooks";
import { useParams } from "react-router-dom";
import { formatDate } from "@/utils/FormatDate";
import { TripDetailsCard } from "@/components/TripDetailsCard";

export const TripDetailsPage = () => {
  const { id } = useParams();

  const { data, loading, error } = useGetTripByIdQuery({
    variables: { tripId: id || "" },
    skip: !id,
  });

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  const trip = data?.getTripById;

  console.log("trip", trip);

  return (
    <section className="pt-10">
      <h1 className="text-accent">{formatDate(trip?.departure_time, "fr")}</h1>
      <h2 className="text-black text-lg font-semibold ">Votre trajet</h2>
      <TripDetailsCard
        departureCity={trip?.departure_city}
        arrivalCity={trip?.arrival_city}
        departureSubHour="7h40"
        departureAddress="91 rue de charenton"
        arrivalAddress="10 rue du bon shit"
      />{" "}
      <h2 className="text-black text-lg font-semibold ">Votre conducteur</h2>
      <h2 className="text-black text-lg font-semibold ">Passagers</h2>
    </section>
  );
};
