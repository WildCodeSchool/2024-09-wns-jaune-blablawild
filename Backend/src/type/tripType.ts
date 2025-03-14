import { Field, InputType, registerEnumType } from "type-graphql";

export enum TripStatus {
  OPEN = "OPEN",
  CLOSE = "CLOSE",
  FULL = "FULL",
}
registerEnumType(TripStatus, {
    name: "TripStatus",
    description: "Le statut d'un trajet (ouvert, fermé, complet)",
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

  @Field({nullable: true}) // remettre a obligatoire quand création user 
  driverId?: string;

  @Field()
  capacity!: number; 
}

@InputType()
export class FilterTripInput {
  @Field()
  arrival!: string

  @Field()
  departure!: string

  @Field(() => Date)
  startDate!: Date

  @Field(() => Date)
  endDate!: Date

  @Field()
  passengers!: number
}
