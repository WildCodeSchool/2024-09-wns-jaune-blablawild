import { formatDate } from "@/utils/FormatDate";
import { ArrowBigRight, CarIcon } from "lucide-react";
import { DriverInfo } from "./_components/DriverInfo";
import { PassengersList } from "./_components/PassengersList";
import { PriceOverlay } from "./_components/PriceOverlay";
import { TripCardProps } from "./_types/types";
import {
  calculateArrivalTime,
  calculateTripDuration,
  formatHourFromTime,
  getImageUrl,
} from "./_utils/utils";

export default function TripCard({
  trips,
  mode = "search",
}: Readonly<TripCardProps>) {

  return (
    <section className="w-full px-2 py-4 md:p-8">
      <div className="space-y-4">
        {trips.map((trip) => {
          const arrivalTime = calculateArrivalTime(trip.departure_time);

          return (
            <article
              key={trip.id}
              className="relative flex md:h-[232px] bg-white rounded-xl border-solid border-[#E5E5E5] border-1 overflow-hidden hover:shadow-lg transition-shadow duration-150 hover:cursor-pointer hover:ring-2 hover:ring-primary xl:max-w-[1000px]"
            >
              {trip.capacity === 0 && (
                <div className="absolute inset-0  z-10 bg-background/65" />
              )}
              <div className="flex-1 p-4 flex flex-col justify-between ">
                {mode === "published" && (
                  <span className="text-lg text-primary">
                    {formatDate(trip.departure_time, "fr")}
                  </span>
                )}
                <div className="flex gap-2 items-center mb-4 lg:max-w-[500px]">
                  <div className="flex-1">
                    <div className="text-lg font-medium text-gray-900">
                      {formatHourFromTime(trip.departure_time)}
                    </div>
                    <div className="text-base text-gray-600">
                      {trip.departure_city}
                    </div>
                  </div>

                  <div className="flex items-center flex-col px-2">
                    <div className="text-sm text-gray-500 mb-1">
                      {calculateTripDuration(trip.departure_time, arrivalTime)}
                    </div>
                    <ArrowBigRight className="w-6 h-6 text-gray-500" />
                  </div>

                  <div className="flex-1 text-right">
                    <div className="text-lg font-medium text-gray-900">
                      {formatHourFromTime(arrivalTime)}
                    </div>
                    <div className="text-base text-gray-600">
                      {trip.arrival_city}
                    </div>
                  </div>
                </div>
                {mode === "search" ? (
                  <div className="flex justify-between gap-4 mt-auto lg:max-w-[500px]">
                    <DriverInfo driver={trip.driver} />

                    <div className=" flex  flex-col items-center md:flex-row  md:gap-2 md:mt-3">
                      <CarIcon className="w-6 h-6 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {trip.capacity > 0
                          ? `${trip.capacity} siège${
                              trip.capacity > 1 ? "s" : ""
                            } restant${trip.capacity > 1 ? "s" : ""}`
                          : "Complet"}{" "}
                      </span>
                    </div>
                  </div>
                ) : (
                  <PassengersList passengers={trip.passengers} />
                )}
              </div>

              <div className="w-1/3 relative flex items-center justify-center">
                <img
                  src={getImageUrl(trip.arrival_city)}
                  alt={trip.arrival_city}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <PriceOverlay price={trip.price} capacity={trip.capacity} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
