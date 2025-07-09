import { useGetTripByIdQuery } from "@/graphql/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "@/utils/FormatDate";
import { TripLine } from "@/components/ui/tripLine";
import { TripDetailsDriver } from "@/components/TripDetailsDriver";
import { TripDetailsPassenger } from "@/components/TripDetailsPassenger";
import TripDetailsSummary from "@/components/TripDetailsSummary";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";

export const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const { data, loading, error } = useGetTripByIdQuery({
    variables: { tripId: id || "" },
    skip: !id,
  });

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  const trip = data?.getTripById;

  const handleClick = () => {
    navigate(`/reservation/${id}`);
  };

  console.log(trip?.driver?.id);
  
  console.log(user?.id);

  return (
    <div className="pt-6 md:pt-10 pb-6 md:pb-10 bg-white px-4 md:px-30 flex flex-col items-center">
      <div className="w-11/12 md:max-w-[1100px] md:w-full">
        <h1 className="text-accent text-2xl md:text-3xl pb-4 md:pb-7">
          {formatDate(trip?.departure_time, "fr")}
        </h1>

        <section className="flex flex-col lg:flex-row lg:justify-between">
          <div className="w-full lg:w-auto mb-6 lg:mb-0">
            <h2 className="text-black text-lg font-semibold pb-3">
              Votre trajet
            </h2>
            <div className="bg-background w-full sm:w-11/12 md:w-full lg:w-[480px] xl:w-[583px] border-[#E5E5E5] border-1 rounded-lg px-4 md:px-6 py-6 md:py-8 mb-6">
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

          <div className="flex flex-col w-full sm:w-11/12 md:w-full lg:w-auto">
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
           {trip?.driver?.id !== user?.id.toString() && <Button
              className="mt-4 bg-accent h-[50px] rounded-full"
              onClick={handleClick}
            >
              Réserver
            </Button>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TripDetailsPage;
