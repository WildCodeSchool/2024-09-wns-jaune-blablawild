import { FilterTripInput, SortOption } from "@/graphql/hooks";
import { endOfDay, startOfDay } from "date-fns";
import { SearchParams } from "./types";

export function createInitialFilterData(
  searchParams: SearchParams
): FilterTripInput {
  return {
    arrival: searchParams.arrival.trim(),
    departure: searchParams.departure.trim(),
    passengers: Number(searchParams.passengers),
    startDate: startOfDay(new Date(searchParams.date)),
    endDate: endOfDay(new Date(searchParams.date)),
    sortBy: SortOption.Time,
  };
}

function getSortOption(sort: string | null): SortOption | undefined {
  if (sort === "cheapest") return SortOption.Price;
  if (sort === "earliest") return SortOption.Time;
  return undefined;
}

export function updateFilterDataWithSort(
  filterData: FilterTripInput,
  sort: string | null
): FilterTripInput {
  return {
    ...filterData,
    sortBy: getSortOption(sort),
  };
}
