import TripCard from "@/components/TripCard/TripCard";
import { Trip } from "@/graphql/hooks";
import { Loader2 } from "lucide-react";
import { NoTripsFound } from "./NoTripsFound";

interface TripResultsProps {
  readonly isLoading: boolean;
  readonly trips: readonly Trip[];
  readonly departure: string;
  readonly arrival: string;
}

export function TripResults({
  isLoading,
  trips,
  departure,
  arrival,
}: TripResultsProps) {
  if (isLoading) {
    return (
      <section className="flex justify-center items-center min-h-[500px]">
        <Loader2 className="animate-spin w-8 h-8" />
      </section>
    );
  }

  if (trips.length === 0) {
    return <NoTripsFound departure={departure} arrival={arrival} />;
  }

  return (
    <section className="min-h-[500px]">
      <TripCard trips={trips} mode="search" />
    </section>
  );
}
