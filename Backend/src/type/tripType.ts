import { Field, InputType } from "type-graphql";

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
