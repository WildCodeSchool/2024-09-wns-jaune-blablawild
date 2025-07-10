import { formatDate } from "@/utils/FormatDate";
import { Circle, CarIcon } from "lucide-react";
import { DriverInfo } from "./_components/DriverInfo";
import { PassengersList } from "./_components/PassengersList";
import { PriceOverlay } from "./_components/PriceOverlay";
import { TripCardProps } from "./_types/types";
import {
  calculateArrivalTime,
  calculateTripDuration,
  formatHourFromTime,
} from "./_utils/utils";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Trip } from "@/graphql/hooks";
import { useState, useEffect } from "react";
import { getUnsplashImage } from "@/utils/UnsplashService";

export default function TripCard({
  trips,
  mode = "search",
}: Readonly<TripCardProps>) {
  const navigate = useNavigate();
  const [cityImages, setCityImages] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const loadImages = async () => {
      const images = await Promise.all(
        trips.map(async trip => [
          trip.arrival_city,
          await getUnsplashImage(trip.arrival_city)
        ])
      );
      
      setCityImages(Object.fromEntries(images));
    };

    loadImages();
  }, [trips]);  

  const handleNavigateTrip = (trip: Trip) => {
    if (trip.capacity > 0) {
      navigate(`/trip/${trip.id}`);
    }
  };

  return (
    <section className="w-full px-2 py-4 md:p-8">
      <div className="space-y-4">
        {trips.map((trip) => {
          const arrivalTime = calculateArrivalTime(trip.departure_time);

          return (
            <article
              key={trip.id}
              onClick={() => handleNavigateTrip(trip)}
              className={`${
                trip.capacity > 0
                  ? "hover:shadow-base hover:cursor-pointer hover:ring-1 hover:ring-primary"
                  : ""
              } relative flex md:h-[232px] bg-background rounded-xl border-solid border-[#E5E5E5] border-1 overflow-hidden  transition-shadow duration-150  xl:max-w-[1000px]`}
            >
              {trip.capacity === 0 && (
                <div className="absolute inset-0  z-10 bg-background/65" />
              )}

              <div className="flex-1 p-4 flex flex-col justify-between ">
                <p className="text-base text-accent mb-2">
                  {formatDate(trip.departure_time, "fr")}
                </p>
                <div className=" flex gap-2 items-center mb-4 lg:max-w-[500px]">
                  <div className="flex-1">
                    <div className="text-lg font-medium text-gray-900">
                      {formatHourFromTime(trip.departure_time)}
                    </div>
                    <div className="text-lg  capitalize font-medium text-gray-900 max-w-[100px] truncate md:max-w-none block md:hidden">
                      {trip.departure_city.length > 5
                        ? `${trip.departure_city.slice(0, 5)}…`
                        : trip.departure_city}
                    </div>
                    <div className="text-base  capitalize text-gray-600 hidden md:block">
                      {trip.departure_city}
                    </div>
                    <div className="text-sm text-gray-500 hidden md:block">
                      {trip.departure_address}
                    </div>
                  </div>

                  <div className="flex items-center flex-col flex-1 px-2">
                    <div className="text-sm text-gray-500 mb-1">
                      {calculateTripDuration(trip.departure_time, arrivalTime)}
                    </div>
                    <div className="flex items-center w-full">
                      <Circle size={10} className="text-gray-500 flex-shrink-0" />
                      <div className="border-t border-gray-500 flex-1 mx-1"></div>
                      <Circle size={10} className="text-gray-500 flex-shrink-0" />
                    </div>
                  </div>

                  <div className="flex-1 text-right">
                    <div className="text-lg font-medium text-gray-900">
                      {formatHourFromTime(arrivalTime)}
                    </div>
                    <div className="text-lg font-medium capitalize text-gray-900 max-w-[100px] truncate md:max-w-none block md:hidden">
                      {trip.arrival_city.length > 5
                        ? `${trip.arrival_city.slice(0, 5)}…`
                        : trip.arrival_city}
                    </div>
                    <div className="text-base text-gray-600 capitalize hidden md:block">
                      {trip.arrival_city}
                    </div>
                    <div className="text-sm text-gray-500 hidden md:block">
                      {trip.arrival_address}
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
                  src={cityImages[trip.arrival_city] || "/images/cities/default.jpg"}
                  alt={trip.arrival_city}
                  className={clsx(
                    "absolute inset-0 w-full h-full object-cover transition-all duration-300",
                    new Date(trip.departure_time) < new Date() && "grayscale"
                  )}
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