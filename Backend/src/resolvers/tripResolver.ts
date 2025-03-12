import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Trip } from "../entities/trip";
import { CreateTripInput } from "../type/tripType";
import { User } from "../entities/user";

@Resolver(Trip)
export class TripResolver {
  @Query(() => [Trip])
  async getTrip() {
    const trip = await Trip.find({
      relations: {
        driver: true,
      },
    });
    return trip;
  }

  @Mutation(() => String)
  async createTrip(@Arg("data") data: CreateTripInput) {
    const driver = await User.findOneBy({ id: data.driverId });
    if (!driver)
      throw new Error(
        "Aucun conducteur n'existe pour cet id, vous devez fournir un conducteur existant"
      );
    const trip = new Trip();
    Object.assign(trip, data);
    trip.driver = driver;
    await trip.save();
    return JSON.stringify("Le trajet a bien été créé");
  }
}
