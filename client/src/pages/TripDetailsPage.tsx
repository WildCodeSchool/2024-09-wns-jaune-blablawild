import { useGetTripByIdQuery } from "@/graphql/hooks";
import { useParams } from "react-router-dom";
import { formatDate } from "@/utils/FormatDate";
import { TripLine } from "@/components/ui/tripLine";
import { TripDetailsDriver } from "@/components/TripDetailsDriver";
import { TripDetailsPassenger } from "@/components/TripDetailsPassenger";
import TripDetailsSummary from "@/components/TripDetailsSummary";
import { Button } from "@/components/ui/button";

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
    <div className="pt-10 pb-10 bg-white px-30 flex flex-col items-center">
      <div className="max-w-[1100px] w-full">
        <h1 className="text-accent text-3xl pb-7">
          {formatDate(trip?.departure_time, "fr")}
        </h1>

        <section className="flex flex-row justify-between">
          <div className="">
            <h2 className="text-black text-lg font-semibold pb-3">
              Votre trajet
            </h2>
            <div className="bg-background w-[583px] border-[#E5E5E5] border-1 rounded-lg px-6 py-8 mb-6">
              <TripLine
                departureTime={trip?.departure_time || ""}
                departureCity={trip?.departure_city || ""}
                departureAddress="91 rue de charenton"
                arrivalTime={"2023-05-14T19:20:00Z"}
                arrivalCity={trip?.arrival_city || ""}
                arrivalAddress="10 rue du bon"
                tripDuration="7h20"
              />
            </div>

            <h2 className="text-black text-lg font-semibold pb-3">
              Votre conducteur
            </h2>
            <TripDetailsDriver
              driverName={trip?.driver?.firstname || ""}
              driverRating={4.8}
              driverReview="2 avis"
              profileImage={trip?.driver?.profile?.image || ""}
              driverId={trip?.driver?.id || ""}
            />

            {trip?.passengers && trip?.passengers.length > 0 && (
              <>
                <h2 className="text-black text-lg font-semibold pb-3">
                  Passagers
                </h2>
                <TripDetailsPassenger passengers={trip.passengers} />
              </>
            )}
          </div>

          <div className="flex flex-col">
            <TripDetailsSummary
              date={trip?.departure_time || ""}
              departureTime={trip?.departure_time || ""}
              departureCity={trip?.departure_city || ""}
              departureAddress="91 rue de charenton"
              arrivalTime={"2023-05-14T19:20:00Z"}
              arrivalCity={trip?.arrival_city || ""}
              arrivalAddress="10 rue du bon"
              tripDuration={"7h20"}
              driverName={trip?.driver?.firstname || ""}
              driverRating={4.8}
              driverImage={trip?.driver?.profile?.image || undefined}
              driverId={trip?.driver?.id || ""}
            />
            <Button className="mt-4 bg-accent h-[50px] rounded-full">
              Réserver
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TripDetailsPage;
