import { Query, Resolver } from "type-graphql";
import { Trip } from "../entities/trip";

@Resolver(Trip)
export class CoachResolver {
  @Query(() => [Trip])
  async getTrip() {
    const trip = await Trip.find();
    return trip;
  }
}
