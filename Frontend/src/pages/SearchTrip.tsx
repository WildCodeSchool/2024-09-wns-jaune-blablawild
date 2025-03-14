import TripCard from "@/components/TripCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import { FilterTripInput, Trip, useGetTripQuery } from "@/graphql/hooks";
import { Loader2 } from "lucide-react";
import { getUrlParams } from "@/utils";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { endOfDay, startOfDay } from "date-fns";

export default function SearchTrip() {
  const location = useLocation();
  const params = getUrlParams();
  const startDate = startOfDay(new Date(params.date));
  const endDate = endOfDay(new Date(params.date));
  const [data, setData] = useState<FilterTripInput>({
    arrival: params.arrival.trim(),
    departure: params.departure.trim(),
    passengers: Number(params.passengers),
    startDate,
    endDate,
  });
  const { data: dataTrip, loading: loadingTrip } = useGetTripQuery({
    variables: { data },
  });
  const allTrip = dataTrip?.getTrip ?? [];

  useEffect(() => {
    const newData = {
      arrival: params.arrival.trim(),
      departure: params.departure.trim(),
      passengers: Number(params.passengers),
      startDate,
      endDate,
    };
    setData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <section className="h-screen w-screen">
      <section className="relative w-full h-[40vh] flex justify-center items-center">
        <img
          src="/searchTripImg.png"
          alt="Main picture on search trip details"
          className="absolute object-cover top-0 w-full h-full"
        />
        <div className="flex flex-col justify-center items-center gap-7 z-1 w-[70%] md:w-[80%]">
          <p className="text-white text-2xl">Où souhaitez-vous aller ?</p>
          <div className="w-full">
            <SearchBar />
          </div>
        </div>
      </section>
      {!loadingTrip ? (
        <section>
          <TripCard trips={allTrip as Trip[]} />
        </section>
      ) : (
        <section>
          <Loader2 className="animate-spin" />
        </section>
      )}
    </section>
  );
}
