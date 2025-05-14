import TripCard from "@/components/TripCard/TripCard.tsx";
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
import { useLocation } from "react-router-dom";
import { endOfDay, startOfDay } from "date-fns";
import { FilterSideBarWrapper } from "@/components/FilterSideBar/FilterSideBarWrapper";

export default function SearchTrip() {
  const location = useLocation();
  const params = getUrlParams();
  
  const [searchParams, setSearchParams] = useState(params);
  
  const startDate = startOfDay(new Date(searchParams.date));
  const endDate = endOfDay(new Date(searchParams.date));
  const [currentSort, setCurrentSort] = useState<string | null>("earliest");
  const [currentTimeRange, setCurrentTimeRange] = useState<TimeOption[]>([]);
  const [filterData, setFilterData] = useState<FilterTripInput>({
    arrival: searchParams.arrival.trim(),
    departure: searchParams.departure.trim(),
    passengers: Number(searchParams.passengers),
    startDate,
    endDate,
    sortBy: SortOption.Time,
  });

  const { data: dataTrip, loading: loadingTrip, refetch } = useGetTripQuery({
    variables: { data: filterData },
  });

  const handleSortChange = (sort: string | null): void => {
    setCurrentSort(sort);
    
    const newData = {
      ...filterData
    };
    
    if (sort === "cheapest") {
      newData.sortBy = SortOption.Price;
    } else if (sort === "earliest") {
      newData.sortBy = SortOption.Time;
    } else {
      newData.sortBy = undefined;
    }
    
    setFilterData(newData);
  };
  
  const handleTimeRangeChange = (timeRange: TimeOption[]): void => {
    setCurrentTimeRange(timeRange);
    
    const newData = {
      ...filterData
    };
    
    if (timeRange === null) {
      newData.timeOptions = undefined;
    } else {
      newData.timeOptions = timeRange;
    }
    
    setFilterData(newData);
  };
  
  const handleReinstateFilter = () => {
    setCurrentSort(null);
    setCurrentTimeRange([]);
    const newData = {
      ...filterData,
      sortBy: undefined,
      timeOption: undefined
    };
    
    setFilterData(newData);
    
    refetch({
      data: newData
    });
  }

  useEffect(() => {
    const newParams = getUrlParams();
    setSearchParams(newParams);
    
    const newStartDate = startOfDay(new Date(newParams.date));
    const newEndDate = endOfDay(new Date(newParams.date));
    
    const newData = {
      ...filterData,
      arrival: newParams.arrival.trim(),
      departure: newParams.departure.trim(),
      passengers: Number(newParams.passengers),
      startDate: newStartDate,
      endDate: newEndDate,
    };
    
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
    <div className="flex flex-col min-h-screen">
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
            <section className="min-h-[300px]">
              {allTrips.length === 0 ? (
                displayNoTrips()
              ) : (
                <TripCard trips={allTrips as Trip[]} />
              )}
            </section>
          ) : (
            <section className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="animate-spin w-8 h-8" />
            </section>
          )
        }
      />
    </div>
  );
}