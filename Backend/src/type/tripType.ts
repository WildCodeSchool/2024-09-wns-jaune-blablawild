import { Field, InputType, registerEnumType } from "type-graphql";

export enum TripStatus {
  OPEN = "OPEN",
  CLOSE = "CLOSE",
  FULL = "FULL",
}

export enum TimeOption {
  Before_6 = "Before_6",
  From_6To_12 = "From_6To_12",
  From_12To_18 = "From_12To_18",
  After_18 = "After_18",
}

export enum SortOption {
  PRICE = "PRICE",
  TIME = "TIME",
}

export enum TripStatusFilter {
  UPCOMING = "upcoming",
  PAST = "past",
  PUBLISHED = "published",
}

registerEnumType(TripStatus, {
  name: "TripStatus",
  description: "Le statut d'un trajet (ouvert, fermé, complet)",
});

registerEnumType(TimeOption, {
  name: "TimeOption",
  description: "Options for filtering by time of day",
});

registerEnumType(SortOption, {
  name: "SortOption",
  description: "Options for sorting trips",
});

registerEnumType(TripStatusFilter, {
  name: "TripStatusFilter",
  description: "Status for a trip",
});

@InputType()
export class CreateTripInput {
  @Field()
  departure_city!: string;

  @Field()
  arrival_city!: string;

  @Field()
  departure_time!: Date;

  @Field()
  price!: number;

  @Field({ nullable: true }) // remettre a obligatoire quand création user
  driverId?: string;

  @Field()
  capacity!: number;
}

@InputType()
export class FilterTripInput {
  @Field()
  arrival!: string;

  @Field()
  departure!: string;

  @Field(() => Date)
  startDate!: Date;

  @Field(() => Date)
  endDate!: Date;

  @Field()
  passengers!: number;

  @Field(() => TimeOption, { nullable: true })
  timeOption?: TimeOption;

  @Field(() => SortOption, { nullable: true })
  sortBy?: SortOption;
}
