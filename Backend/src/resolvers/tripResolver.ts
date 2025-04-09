import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Trip } from "../entities/trip";
import { CreateTripInput, FilterTripInput, SortOption, TimeOption } from "../type/tripType";
import { User } from "../entities/user";
import { Between, FindOptionsWhere, ILike, MoreThanOrEqual } from "typeorm";

@Resolver(Trip)
export class TripResolver {
  @Query(() => [Trip])
  async getTrip(@Arg("data", () => FilterTripInput) data: FilterTripInput) {
    const where: FindOptionsWhere<Trip> = {
      departure_city: ILike(`%${data.departure}%`),
      arrival_city: ILike(`%${data.arrival}%`),
      capacity: MoreThanOrEqual(data.passengers),
      departure_time: Between(data.startDate, data.endDate)
    };

    let orderBy = {};
    if (data.sortBy === SortOption.PRICE) {
      orderBy = { price: "ASC" };
    } else if (data.sortBy === SortOption.TIME) {
      orderBy = { departure_time: "ASC" };
    }

    try {
      const trips = await Trip.find({
        where,
        order: orderBy,
        relations: {
          driver: true,
          passengers: true
        },
      });

      let filteredTrips = trips;
      
      if (data.timeOption) {
        filteredTrips = trips.filter(trip => {
          const departureHour = new Date(trip.departure_time).getUTCHours();
          
          switch (data.timeOption) {
            case TimeOption.Before_6:
              return departureHour < 6;
            case TimeOption.From_6To_12:
              return departureHour >= 6 && departureHour < 12;
            case TimeOption.From_12To_18:
              return departureHour >= 12 && departureHour < 18;
            case TimeOption.After_18:
              return departureHour >= 18;
            default:
              return true;
          }
        });
      }
      
      return filteredTrips;
    } catch (error) {
      throw error;
    }
  }
  
  @Query(() => [Trip])
  async getPopularTrip() {
    const popularTrip = await Trip.find({
      take: 5,
    });
    return popularTrip;
  }

  @Mutation(() => String)
  async createTrip(@Arg("data", () => CreateTripInput) data: CreateTripInput) {
    const driver = await User.findOneBy({ id: data.driverId });
    const trip = new Trip();
    Object.assign(trip, data);
    await trip.save();
    return JSON.stringify("Le trajet a bien été créé");
  }
}