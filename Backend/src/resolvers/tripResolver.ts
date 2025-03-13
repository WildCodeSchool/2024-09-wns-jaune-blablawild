import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Trip } from "../entities/trip";
import { CreateTripInput, FilterTripInput } from "../type/tripType";
import { User } from "../entities/user";
import { Between, ILike, MoreThanOrEqual } from "typeorm";

@Resolver(Trip)
export class TripResolver {
  @Query(() => [Trip])
  async getTrip(@Arg("data") data: FilterTripInput) {
    const trip = await Trip.find({
      where: {
        departure_city: ILike(data.departure),
        arrival_city: ILike(data.arrival),
        departure_time: Between(data.startDate, data.endDate),
        capacity: MoreThanOrEqual(data.passengers),
      },
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
