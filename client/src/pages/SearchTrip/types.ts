import { FilterTripInput, TimeOption } from "@/graphql/hooks";

export interface SearchParams {
  arrival: string;
  departure: string;
  passengers: number;
  date: string;
}

export interface FilterState {
  currentSort: string | null;
  currentTimeRange: TimeOption | null;
  filterData: FilterTripInput;
}
