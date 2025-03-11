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
  depature_city!: string;

  @Field()
  arrival_city!: string;

  @Field()
  depature_time!: Date;

  @Field()
  price!: number;

  @Field()
  driverId!: string;
}
