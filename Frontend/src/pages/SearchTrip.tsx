import { FilterSideBarWrapper } from "@/components/FilterSideBar/FilterSideBarWrapper";
import SearchBar from "@/components/SearchBar/SearchBar";
import TripCard from "@/components/TripCard/TripCard";
import {
  FilterTripInput,
  Trip,
  useGetCheapestTripsQuery,
  useGetEarliestTripsQuery,
  useGetTripsByTimeQuery,
} from "@/graphql/hooks";
import { getUrlParams } from "@/utils";
import { endOfDay, startOfDay } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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
  const [filterData, setFilterData] = useState<FilterTripInput>({
    arrival: searchParams.arrival.trim(),
    departure: searchParams.departure.trim(),
    passengers: Number(searchParams.passengers),
    startDate,
    endDate,
    sortBy: SortOption.Time,
  });

  const dateComponents = params.date.split("T")[0];
  const utcDate = `${dateComponents}T00:00:00Z`;

  const { data: cheapestTrips, loading: loadingCheapestTrips } =
    useGetCheapestTripsQuery({
      variables: {
        arrivalCity: data.arrival,
        departureCity: data.departure,
        date: utcDate,
      },
      skip: currentSort !== "cheapest",
    });

  const { data: earliestTrips, loading: loadingEarliestTrips } =
    useGetEarliestTripsQuery({
      variables: {
        arrivalCity: data.arrival,
        departureCity: data.departure,
        date: utcDate,
      },
      skip: currentSort !== "earliest",
    });

  const { data: timeRangeTripData, loading: loadingTimeRangeTrip } =
    useGetTripsByTimeQuery({
      variables: {
        time: currentTimeRange || "",
        arrivalCity: data.arrival,
        departureCity: data.departure,
        date: utcDate,
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
      ...filterData,
      arrival: newParams.arrival.trim(),
      departure: newParams.departure.trim(),
      passengers: Number(newParams.passengers),
      startDate: newStartDate,
      endDate: newEndDate,
    };
    setData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <section className="h-screen w-screen">
      <section className="relative w-full h-[55vh] flex justify-center items-center">
        <img
          src="/searchTripImg.png"
          alt=""
          className="absolute object-cover top-0 w-full h-full"
        />
        <div className="flex flex-col justify-center items-center gap-7 z-1 w-[70%] md:w-[80%]">
          <p className="text-white text-2xl">Où souhaitez-vous aller ?</p>
          <div className="w-full">
            <SearchBar />
          </div>
        </div>
      </section>

      <FilterSideBarWrapper
        onReinstateChange={handleReinstateFilter}
        onSortChange={handleSortChange}
        onTimeRangeChange={handleTimeRangeChange}
        currentSort={currentSort}
        currentTimeRange={currentTimeRange}
      >
        {!isLoading ? (
          <section className="min-h-[500px]">
            <TripCard trips={tripsToShow as Trip[]} mode="search" />
          </section>
        ) : (
          <section className="flex justify-center items-center min-h-[500px]">
            <Loader2 className="animate-spin w-8 h-8" />
          </section>
        )}
      </FilterSideBarWrapper>
    </section>
  );
}
