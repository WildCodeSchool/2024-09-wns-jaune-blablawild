import { Arg, Query, Resolver } from "type-graphql";
import { Trip } from "../entities/trip";
import { Between, FindOptionsWhere, LessThan, MoreThan } from "typeorm";

enum TimeOption {
  BEFORE_6 = "BEFORE_6",
  FROM_6_TO_12 = "FROM_6_TO_12",
  FROM_12_TO_18 = "FROM_12_TO_18",
  AFTER_18 = "AFTER_18",
}

@Resolver(Trip)
export class FiltersResolver {
  @Query(() => [Trip])
  async getCheapestTrips(
    @Arg("arrival_city", { nullable: true }) arrival_city?: string
  ) {
    const where: FindOptionsWhere<Trip> = arrival_city ? { arrival_city } : {};

    const trips = await Trip.find({
      where,
      order: {
        price: "ASC",
      },
      relations: {
        driver: true,
      },
    });
    return trips;
  }

  @Query(() => [Trip])
  async getEarliestTrips(
    @Arg("arrival_city", { nullable: true }) arrival_city?: string
  ) {
    const where: FindOptionsWhere<Trip> = arrival_city ? { arrival_city } : {};

    const trips = await Trip.find({
      where,
      order: {
        departure_time: "ASC",
      },
      relations: {
        driver: true,
      },
    });
    return trips;
  }

  @Query(() => [Trip])
  async getTripsByTime(
    @Arg("time", { nullable: false }) time: TimeOption,
    @Arg("arrival_city", { nullable: true }) arrival_city?: string
  ) {
    const where: FindOptionsWhere<Trip> = arrival_city ? { arrival_city } : {};

    const getTimeForHour = (hour: number): Date => {
      const date = new Date();
      date.setHours(hour, 0, 0, 0);
      return date;
    };

    switch (time) {
      case TimeOption.BEFORE_6:
        where.departure_time = LessThan(getTimeForHour(6));
        break;
      case TimeOption.FROM_6_TO_12:
        where.departure_time = Between(getTimeForHour(6), getTimeForHour(12));
        break;
      case TimeOption.FROM_12_TO_18:
        where.departure_time = Between(getTimeForHour(12), getTimeForHour(18));
        break;
      case TimeOption.AFTER_18:
        where.departure_time = MoreThan(getTimeForHour(18));
        break;
    }
    const trips = await Trip.find({
      where,
      order: { departure_time: "ASC" },
      relations: { driver: true },
    });

    return trips;
  }
}
