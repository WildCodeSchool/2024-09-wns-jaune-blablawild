import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Trip } from "../entities/trip";
import { CreateTripInput, FilterTripInput } from "../type/tripType";
import { User } from "../entities/user";
import { Between, ILike, MoreThan, LessThan, MoreThanOrEqual } from "typeorm";
import { getPopular } from "../services/TripServices";

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

  @Query(() => [Trip])
  async getPopularTrip() {
    const popularTrip = await Trip.find({
      take: 5,
    });
    return popularTrip;
  }

  @Query(() => [Trip])
  async getTripByUser(
    @Arg("userId") userId: string,
    @Arg("filter", { nullable: true }) filter: "upcoming" | "past" | "published"
  ) {
    const today = new Date();

    let whereClause: any = { driver: { id: userId } };

    if (filter === "upcoming") {
      whereClause.departure_time = MoreThan(today);
    } else if (filter === "past") {
      whereClause.departure_time = LessThan(today);
    } else if (filter === "published") {
    }

    const trips = await Trip.find({
      where: whereClause,
      relations: { passengers: true, driver: true },
    });

    if (!trips) {
      throw new Error("No trips found for this user");
    }

    console.log("trip", trips);

    return trips;
  }

  @Mutation(() => String)
  async createTrip(@Arg("data") data: CreateTripInput) {
    const driver = await User.findOneBy({ id: data.driverId });
    // if (!driver)
    //   throw new Error(
    //     "Aucun conducteur n'existe pour cet id, vous devez fournir un conducteur existant"
    //   );
    const trip = new Trip();
    Object.assign(trip, data);
    // trip.driver = driver;
    await trip.save();
    return JSON.stringify("Le trajet a bien été créé");
  }
}
