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
    @Arg("arrival_city", { nullable: true }) arrival_city?: string,
    @Arg("date", { nullable: true }) date?: Date
  ) {
    const where: FindOptionsWhere<Trip> = {};
    
    if (arrival_city) {
      where.arrival_city = arrival_city;
    }
    
    if (date) {
      const dateStr = date.toISOString();
      const [fullDate] = dateStr.split('T');
      const [year, month, day] = fullDate.split('-').map(Number);
      
      const startDate = new Date(year, month - 1, day, 0, 0, 0);
      const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
      
      where.departure_time = Between(startDate, endDate);
    }
    
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
    @Arg("arrival_city", { nullable: true }) arrival_city?: string,
    @Arg("date", { nullable: true }) date?: Date
  ) {
    const where: FindOptionsWhere<Trip> = {};
    
    if (arrival_city) {
      where.arrival_city = arrival_city;
    }
    
    if (date) {
      const dateStr = date.toISOString();
      const [fullDate] = dateStr.split('T');
      const [year, month, day] = fullDate.split('-').map(Number);
      
      const startDate = new Date(year, month - 1, day, 0, 0, 0);
      const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);
      
      where.departure_time = Between(startDate, endDate);
    }
    
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
    @Arg("arrival_city", { nullable: true }) arrival_city?: string,
    @Arg("date", { nullable: true }) date?: Date
  ) {
    let where: FindOptionsWhere<Trip> = {};
    
    if (arrival_city) {
      where.arrival_city = arrival_city;
    }
    
    let startOfDay: Date | undefined;
    let endOfDay: Date | undefined;
    
    if (date) {
      const dateStr = date.toISOString();
      const [fullDate] = dateStr.split('T');
      const [year, month, day] = fullDate.split('-').map(Number);
      
      startOfDay = new Date(year, month - 1, day, 0, 0, 0);
      endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
    }
    
    const getTimeForHour = (hour: number): Date => {
      if (!date) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();
        return new Date(year, month, day, hour, 0, 0);
      }
      
      const dateStr = date.toISOString();
      const [fullDate] = dateStr.split('T');
      const [year, month, day] = fullDate.split('-').map(Number);
      
      return new Date(year, month - 1, day, hour, 0, 0);
    };
    
    let finalWhere: FindOptionsWhere<Trip> = { ...where };
    
    switch (time) {
      case TimeOption.BEFORE_6:
        if (date) {
          finalWhere.departure_time = Between(startOfDay!, getTimeForHour(6));
        } else {
          finalWhere.departure_time = LessThan(getTimeForHour(6));
        }
        break;
      case TimeOption.FROM_6_TO_12:
        finalWhere.departure_time = Between(getTimeForHour(6), getTimeForHour(12));
        break;
      case TimeOption.FROM_12_TO_18:
        finalWhere.departure_time = Between(getTimeForHour(12), getTimeForHour(18));
        break;
      case TimeOption.AFTER_18:
        if (date) {
          finalWhere.departure_time = Between(getTimeForHour(18), endOfDay!);
        } else {
          finalWhere.departure_time = MoreThan(getTimeForHour(18));
        }
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