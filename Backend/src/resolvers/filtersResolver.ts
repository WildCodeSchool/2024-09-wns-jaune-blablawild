import { Arg, Query, Resolver, registerEnumType } from "type-graphql";
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
    @Arg("departure_city") departure_city: string,
    @Arg("arrival_city") arrival_city: string,
    @Arg("date") date: Date
  ) {
    const where: FindOptionsWhere<Trip> = {
      departure_city,
      arrival_city
    };
    
    const dateStr = date.toISOString();
    const [fullDate] = dateStr.split('T');
    const [year, month, day] = fullDate.split('-').map(Number);
    
    const startDate = new Date(year, month - 1, day, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
    
    where.departure_time = Between(startDate, endDate);
    
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
    @Arg("departure_city") departure_city: string,
    @Arg("arrival_city") arrival_city: string,
    @Arg("date") date: Date
  ) {
    const where: FindOptionsWhere<Trip> = {
      departure_city,
      arrival_city
    };
    
    const dateStr = date.toISOString();
    const [fullDate] = dateStr.split('T');
    const [year, month, day] = fullDate.split('-').map(Number);
    
    const startDate = new Date(year, month - 1, day, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
    
    where.departure_time = Between(startDate, endDate);
    
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
    @Arg("departure_city") departure_city: string,
    @Arg("arrival_city") arrival_city: string,
    @Arg("date") date: Date
  ) {
    const where: FindOptionsWhere<Trip> = {
      departure_city,
      arrival_city
    };
    
    const dateStr = date.toISOString();
    const [fullDate] = dateStr.split('T');
    const [year, month, day] = fullDate.split('-').map(Number);
    
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
    
    const getTimeForHour = (hour: number): Date => {
      return new Date(year, month - 1, day, hour, 0, 0);
    };
    
    let finalWhere: FindOptionsWhere<Trip> = { ...where };
    
    switch (time) {
      case TimeOption.BEFORE_6:
        finalWhere.departure_time = Between(startOfDay, getTimeForHour(6));
        break;
      case TimeOption.FROM_6_TO_12:
        finalWhere.departure_time = Between(getTimeForHour(6), getTimeForHour(12));
        break;
      case TimeOption.FROM_12_TO_18:
        finalWhere.departure_time = Between(getTimeForHour(12), getTimeForHour(18));
        break;
      case TimeOption.AFTER_18:
        finalWhere.departure_time = Between(getTimeForHour(18), endOfDay);
        break;
    }
    
    const trips = await Trip.find({
      where: finalWhere,
      order: { departure_time: "ASC" },
      relations: { driver: true },
    });
    
    return trips;
  }
}