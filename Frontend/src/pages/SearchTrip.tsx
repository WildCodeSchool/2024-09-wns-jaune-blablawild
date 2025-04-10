import TripCard from "@/components/TripCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import {
  FilterTripInput,
  SortOption,
  TimeOption,
  Trip,
  useGetTripQuery,
} from "@/graphql/hooks";
import { Loader2 } from "lucide-react";
import { getUrlParams } from "@/utils";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { endOfDay, startOfDay } from "date-fns";
import { FilterSideBarWrapper } from "@/components/FilterSideBar/FilterSideBarWrapper";

export default function SearchTrip() {
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const params = getUrlParams();

  const startDate = startOfDay(new Date(params.date));
  const endDate = endOfDay(new Date(params.date));
  const [currentSort, setCurrentSort] = useState<string | null>("earliest");
  const [currentTimeRange, setCurrentTimeRange] = useState<TimeOption[]>([]);
  const [filterData, setFilterData] = useState<FilterTripInput>({
    arrival: params.arrival.trim(),
    departure: params.departure.trim(),
    passengers: Number(params.passengers),
    startDate,
    endDate,
    sortBy: SortOption.Time,
  });

  const {
    data: dataTrip,
    loading: loadingTrip,
    refetch,
  } = useGetTripQuery({
    variables: { data: filterData },
  });

  const handleSortChange = (sort: string | null): void => {
    setCurrentSort(sort);

    const newSearchParams = new URLSearchParams(searchParams.toString());

    const newData = {
      ...filterData,
    };

    if (sort === "cheapest") {
      newData.sortBy = SortOption.Price;
      newSearchParams.set("sort", sort);
    } else if (sort === "earliest") {
      newData.sortBy = SortOption.Time;
      newSearchParams.set("sort", sort);
    } else {
      newData.sortBy = undefined;
      newSearchParams.delete("sort");
    }
    setSearchParams(newSearchParams);
    setFilterData(newData);
  };

  const handleTimeRangeChange = (timeRange: TimeOption[]): void => {
    setCurrentTimeRange(timeRange);
    const newSearchParams = new URLSearchParams(searchParams.toString());

    const newData = {
      ...filterData,
    };

    if (timeRange === null) {
      newData.timeOptions = undefined;
      newSearchParams.delete("time");
    } else {
      newData.timeOptions = timeRange;
      newSearchParams.set("time", timeRange.join(","));
    }

    setFilterData(newData);
    setSearchParams(newSearchParams);
  };

  const handleReinstateFilter = () => {
    setCurrentSort(null);
    setCurrentTimeRange([]);

    const baseParams = {
      departure: params.departure,
      arrival: params.arrival,
      passengers: params.passengers,
      date: params.date,
    };

    const newData = {
      ...filterData,
      sortBy: undefined,
      timeOptions: undefined,
    };

    setFilterData(newData);
    setSearchParams(baseParams);
    refetch({
      data: newData,
    });
  };

  useEffect(() => {
    const newParams = getUrlParams();
    setSearchParams(newParams);

    const newStartDate = startOfDay(new Date(newParams.date));
    const newEndDate = endOfDay(new Date(newParams.date));

    const sortParam = searchParams.get("sort");
    const timeParams = searchParams.get("time");

    const newData = {
      ...filterData,
      arrival: newParams.arrival.trim(),
      departure: newParams.departure.trim(),
      passengers: Number(newParams.passengers),
      startDate: newStartDate,
      endDate: newEndDate,
    };

    if (sortParam) {
      newData.sortBy =
      sortParam === "cheapest" ? SortOption.Price : SortOption.Time;
      setCurrentSort(sortParam);
    }

    if (timeParams) {
      const timeParam = timeParams.split(",") as TimeOption[];
      newData.timeOptions = timeParam;
      setCurrentTimeRange(timeParam);
    }

    setFilterData(newData);
  }, [location.search]);

  const allTrips = dataTrip?.getTrip || [];

  const displayNoTrips = () => {
    return (
      <section className="p-10 min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <p className="md:text-xl">{`Aucun trajet trouvé de ${filterData.departure} à ${filterData.arrival} pour cette période.`}</p>
        </div>
      </section>
    );
  };

  return (
    <section className="h-screen w-screen">
      <section className="relative w-full h-[55vh] flex justify-center items-center">
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

      <FilterSideBarWrapper
        onReinstateChange={handleReinstateFilter}
        onSortChange={handleSortChange}
        onTimeRangeChange={handleTimeRangeChange}
        currentSort={currentSort}
        currentTimeRange={currentTimeRange}
        children={
          !loadingTrip ? (
            <section className="min-h-[500px]">
              {allTrips.length === 0 ? (
                displayNoTrips()
              ) : (
                <TripCard trips={allTrips as Trip[]} />
              )}
            </section>
          ) : (
            <section className="flex justify-center items-center min-h-[500px]">
              <Loader2 className="animate-spin w-8 h-8" />
            </section>
          )
        }
      />
    </section>
  );
}
