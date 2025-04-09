import { Trip, User } from "@/graphql/hooks";

export interface TripCardProps {
  readonly trips: readonly Trip[];
  readonly mode?: "search" | "published";
}

export interface DriverInfoProps {
  firstname?: string;
  image?: string;
}

export interface PassengersListProps {
  passengers: User[] | null | undefined;
}
