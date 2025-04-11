import { FilterSideBarWrapper } from "@/components/FilterSideBar/FilterSideBarWrapper";
import { TimeOption, Trip, useGetTripQuery } from "@/graphql/hooks";
import { getUrlParams } from "@/utils";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SearchHeader } from "./components/SearchHeader";
import { TripResults } from "./components/TripResults";
import type { FilterState, SearchParams } from "./types";
import { createInitialFilterData, updateFilterDataWithSort } from "./utils";

export default function SearchTrip() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    arrival: getUrlParams().arrival || "",
    departure: getUrlParams().departure || "",
    passengers: Number(getUrlParams().passengers) || 1,
    date: getUrlParams().date || new Date().toISOString(),
  });

  const [filterState, setFilterState] = useState<FilterState>({
    currentSort: "earliest",
    currentTimeRange: null,
    filterData: createInitialFilterData(searchParams),
  });

  const {
    data: dataTrip,
    loading: loadingTrip,
    refetch,
  } = useGetTripQuery({
    variables: { data: filterState.filterData },
  });

  const handleSortChange = (sort: string | null): void => {
    setFilterState((prev) => ({
      ...prev,
      currentSort: sort,
      filterData: updateFilterDataWithSort(prev.filterData, sort),
    }));
  };

  const handleTimeRangeChange = (timeRange: TimeOption | null): void => {
    setFilterState((prev) => ({
      ...prev,
      currentTimeRange: timeRange,
      filterData: {
        ...prev.filterData,
        timeOption: timeRange ?? undefined,
      },
    }));
  };

  const handleReinstateFilter = () => {
    const resetState = {
      currentSort: null,
      currentTimeRange: null,
      filterData: {
        ...filterState.filterData,
        sortBy: undefined,
        timeOption: undefined,
      },
    };

    setFilterState(resetState);
    refetch({ data: resetState.filterData });
  };

  useEffect(() => {
    const params = getUrlParams();
    const newParams: SearchParams = {
      arrival: params.arrival || "",
      departure: params.departure || "",
      passengers: Number(params.passengers) || 1,
      date: params.date || new Date().toISOString(),
    };
    setSearchParams(newParams);
    setFilterState((prev) => ({
      ...prev,
      filterData: createInitialFilterData(newParams),
    }));
  }, [location.search]);

  return (
    <section className="h-screen w-screen">
      <SearchHeader />

      <FilterSideBarWrapper
        onReinstateChange={handleReinstateFilter}
        onSortChange={handleSortChange}
        onTimeRangeChange={handleTimeRangeChange}
        currentSort={filterState.currentSort}
        currentTimeRange={filterState.currentTimeRange}
      >
        <TripResults
          isLoading={loadingTrip}
          trips={(dataTrip?.getTrip || []) as Trip[]}
          departure={filterState.filterData.departure}
          arrival={filterState.filterData.arrival}
        />
      </FilterSideBarWrapper>
    </section>
  );
}
