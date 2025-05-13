import { useGetTripByIdQuery } from "@/graphql/hooks";
import { useParams } from "react-router-dom";
import { formatDate } from "@/utils/FormatDate";
import { TripDetailsCard } from "@/components/TripDetailsCard";
import { TripDetailsDriver } from "@/components/TripDetailsDriver";
import { TripDetailsPassenger } from "@/components/TripDetailsPassenger";

export const TripDetailsPage = () => {
  const { id } = useParams();

  const { data, loading, error } = useGetTripByIdQuery({
    variables: { tripId: id || "" },
    skip: !id,
  });

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  const trip = data?.getTripById;

  return (
    <section className="pt-10 pb-10 bg-white px-30">
      <h1 className="text-accent text-3xl pb-7">
        {trip?.departure_time
          ? formatDate(trip.departure_time, "fr")
          : "Date inconnue"}
      </h1>

      <h2 className="text-black text-lg font-semibold pb-3">Votre trajet</h2>
      <TripDetailsCard
        departureCity={trip?.departure_city || ""}
        arrivalCity={trip?.arrival_city || ""}
        departureHour={trip?.departure_time || ""}
        departureAddress="91 rue de charenton"
        arrivalAddress="10 rue du bon"
        arrivalHour={"19h20"}
        timeTrip="7h20"
      />

      <h2 className="text-black text-lg font-semibold pb-3">
        Votre conducteur
      </h2>
      <TripDetailsDriver
        driverName={trip?.driver?.firstname}
        driverRating={4.8}
        driverReview="2 avis"
        profileImage={trip?.driver?.profile}
        driverId={trip?.driver?.id}
      />

      {trip?.passengers && trip?.passengers.length > 0 && (
        <>
          <h2 className="text-black text-lg font-semibold pb-3">Passagers</h2>
          <TripDetailsPassenger passengers={trip.passengers} />
        </>
      )}
    </section>
  );
};

export default TripDetailsPage;
