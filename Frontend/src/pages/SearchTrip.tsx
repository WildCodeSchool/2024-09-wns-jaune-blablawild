import TripCard from "@/components/TripCard";
import img from "../../public/searchTripImg.png";
import SearchBar from "@/components/SearchBar/SearchBar";
import {
  FilterTripInput,
  Trip,
  useGetCheapestTripsQuery,
  useGetEarliestTripsQuery,
  useGetTripQuery,
  useGetTripsByTimeQuery,
} from "@/graphql/hooks";
import { Loader2 } from "lucide-react";
import { getUrlParams } from "@/utils";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { endOfDay, startOfDay } from "date-fns";
import { FilterSideBarWrapper } from "@/components/FilterSideBarWrapper";

export enum TimeOption {
  BEFORE_6 = "BEFORE_6",
  FROM_6_TO_12 = "FROM_6_TO_12",
  FROM_12_TO_18 = "FROM_12_TO_18",
  AFTER_18 = "AFTER_18",
}

export default function SearchTrip() {
  const location = useLocation();
  const params = getUrlParams();
  const startDate = startOfDay(new Date(params.date));
  const endDate = endOfDay(new Date(params.date));
  const [currentSort, setCurrentSort] = useState<string | null>("earliest");
  const [currentTimeRange, setCurrentTimeRange] = useState<TimeOption | null>(
    null
  );
  const [data, setData] = useState<FilterTripInput>({
    arrival: params.arrival.trim(),
    departure: params.departure.trim(),
    passengers: Number(params.passengers),
    startDate,
    endDate,
  });
  const { data: dataTrip, loading: loadingTrip } = useGetTripQuery({
    variables: { data },
    skip: currentSort !== null || currentTimeRange !== null,
  });

  const { data: cheapestTrips, loading: loadingCheapestTrips } =
    useGetCheapestTripsQuery({
      variables: { arrivalCity: data.arrival },
      skip: currentSort !== "cheapest",
    });

  const { data: earliestTrips, loading: loadingEarliestTrips } =
    useGetEarliestTripsQuery({
      variables: { arrivalCity: data.arrival },
      skip: currentSort !== "earliest",
    });

  const { data: timeRangeTripData, loading: loadingTimeRangeTrip } =
    useGetTripsByTimeQuery({
      variables: {
        time: currentTimeRange || "",
        arrivalCity: data.arrival,
      },
      skip: currentTimeRange === null,
    });

  let tripsToShow = [];
  let isLoading = false;

  if (currentSort === "cheapest") {
    tripsToShow = cheapestTrips?.getCheapestTrips || [];
    isLoading = loadingCheapestTrips;
  } else if (currentSort === "earliest") {
    tripsToShow = earliestTrips?.getEarliestTrips || [];
    isLoading = loadingEarliestTrips;
  } else if (currentTimeRange) {
    tripsToShow = timeRangeTripData?.getTripsByTime || [];
    isLoading = loadingTimeRangeTrip;
  } else {
    tripsToShow = dataTrip?.getTrip || [];
    isLoading = loadingTrip;
  }

  const handleSortChange = (sort: string | null): void => {
    setCurrentSort(sort);
  };

  const handleTimeRangeChange = (timeRange: TimeOption | null): void => {
    setCurrentTimeRange(timeRange);
  };

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

  const displayNoTrips = () => {
    return (
      <section className="p-10">
        <p className="text-xl ">{`Il n'y a pas encore de trajet disponible de ${data.departure} à ${data.arrival} ce jour là ! `}</p>
      </section>
    );
  };

  return (
    <section className="w-screen">
      <section className="relative w-full h-[60vh] flex justify-center items-center">
        <img
          src={img}
          alt="Main picture on search trip details"
          className="absolute object-cover top-0 w-full h-full"
        />
        <div className="flex flex-col justify-center items-center gap-5 z-1 w-[70%] md:w-[80%]">
          <p className="text-white text-2xl">Où souhaitez-vous aller ?</p>
          <div className="w-full md:h-[45px]">
            <SearchBar />
          </div>
        </div>
      </section>

      <FilterSideBarWrapper
        onSortChange={handleSortChange}
        onTimeRangeChange={handleTimeRangeChange}
        currentSort={currentSort}
        currentTimeRange={currentTimeRange}
        children={
          !isLoading ? (
            <section>
              {tripsToShow.length === 0 ? (
                displayNoTrips()
              ) : (
                <TripCard trips={tripsToShow as Trip[]} />
              )}
            </section>
          ) : (
            <section className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin w-8 h-8" />
            </section>
          )
        }
      />
    </section>
  );
}
