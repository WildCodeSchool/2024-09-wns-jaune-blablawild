import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Between, FindOptionsWhere, ILike, LessThan, MoreThan } from "typeorm";
import { Trip } from "../entities/trip";
import { User } from "../entities/user";
import {
  BookTripInput,
  CancelTripBookingInput,
  CreateTripInput,
  FilterTripInput,
  SortOption,
  TimeOption,
  TripStatus,
  TripStatusFilter,
} from "../type/tripType";

@Resolver(Trip)
export class TripResolver {
  @Query(() => [Trip])
  async getTrip(@Arg("data", () => FilterTripInput) data: FilterTripInput) {
    const where: FindOptionsWhere<Trip> = {
      departure_city: ILike(`%${data.departure}%`),
      arrival_city: ILike(`%${data.arrival}%`),
      departure_time: Between(data.startDate, data.endDate),
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
          passengers: true,
        },
      });

      let filteredTrips = trips.filter(
        (trip) => trip.capacity >= data.passengers || trip.capacity === 0
      );

      if (data.timeOptions && data.timeOptions.length > 0) {
        filteredTrips = trips.filter((trip) => {
          const departureHour = new Date(trip.departure_time).getUTCHours();

          return data.timeOptions?.some((option) => {
            switch (option) {
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

  @Query(() => [Trip])
  async getTripByUser(
    @Arg("userId") userId: string,
    @Arg("filter", { nullable: true }) filter: TripStatusFilter,
    @Arg("asPassenger", { nullable: true, defaultValue: false })
    asPassenger: boolean
  ) {
    const today = new Date();

    if (asPassenger) {
      const trips = await Trip.find({
        where: {
          passengers: {
            id: userId,
          },
        },
        relations: {
          passengers: true,
          driver: true,
          reviews: {
            sender: true,
            receiver: true,
          },
        },
      });

      return trips;
    }

    let whereClause: any = { driver: { id: userId } };

    if (filter === TripStatusFilter.UPCOMING) {
      whereClause.departure_time = MoreThan(today);
    } else if (filter === TripStatusFilter.PAST) {
      whereClause.departure_time = LessThan(today);
    } else if (filter === TripStatusFilter.PUBLISHED) {
    }

    const trips = await Trip.find({
      where: whereClause,
      relations: {
        passengers: true,
        driver: true,
        reviews: {
          sender: true,
          receiver: true,
        },
      },
    });

    trips.forEach((trip, index) => {
      if (trip.reviews && trip.reviews.length > 0) {
        trip.reviews.forEach((review, rIndex) => {
          console.log(`Review #${rIndex + 1}:`);
          console.log(`Has sender: ${review.sender ? "Yes" : "NO"}`);
          console.log(`Has receiver: ${review.receiver ? "Yes" : "NO"}`);
        });
      }
    });

    if (!trips) {
      throw new Error("No trips found for this user");
    }

    return trips;
  }

  @Query(() => Trip)
  async getTripById(@Arg("tripId") tripId: string) {
    const trip = await Trip.findOne({
      where: { id: tripId },
      relations: { passengers: true, driver: true },
    });

    if (!trip) {
      throw new Error("No trip found for this id");
    }

    return trip;
  }

  @Mutation(() => String)
  async createTrip(@Arg("data", () => CreateTripInput) data: CreateTripInput) {
    const driver = await User.findOneBy({ id: data.driverId });

    if (!driver) {
      throw new Error("Conducteur non trouvé");
    }

    const trip = new Trip();

    Object.assign(trip, data);
    trip.driver = driver;

    await trip.save();
    return "Le trajet a bien été créé";
  }
  @Mutation(() => String)
  async bookTrip(@Arg("data", () => BookTripInput) data: BookTripInput) {
    try {
      const trip = await Trip.findOne({
        where: { id: data.tripId },
        relations: { passengers: true, driver: true },
      });

      if (!trip) throw new Error("Le trajet n'existe pas");

      if (trip.status === TripStatus.FULL)
        throw new Error("Ce trajet est déjà complet");

      if (trip.status === TripStatus.CLOSE) {
        throw new Error("Ce trajet n'est plus disponible");
      }

      const user = await User.findOneBy({ id: data.userId });
      if (!user) {
        throw new Error("L'utilisateur n'existe pas");
      }

      if (data.userId.toString() === trip.driver.id.toString())
        throw new Error(
          "Vous ne pouvez pas réserver un trajet pour lequel vous êtes conducteur"
        );

      if (!trip.passengers) {
        trip.passengers = [];
      }

      const isAlreadyPassenger = trip.passengers.some(
        (passenger) => passenger.id === user.id
      );
      if (isAlreadyPassenger) {
        throw new Error("Vous avez déjà réservé ce trajet");
      }

      const seatsToBook = data.seatsCount || 1;
      const currentPassengersCount = trip.passengers.length;

      if (currentPassengersCount + seatsToBook > trip.capacity) {
        throw new Error(
          `Il ne reste pas assez de places disponibles. Places disponibles: ${
            trip.capacity - currentPassengersCount
          }`
        );
      }

      trip.passengers.push(user);

      if (trip.passengers.length === trip.capacity) {
        trip.status = TripStatus.FULL;
      }

      await trip.save();

      return "Votre réservation a bien été enregistrée";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Une erreur est survenue lors de la réservation");
    }
  }

  @Mutation(() => String)
  async cancelTripBooking(
    @Arg("data", () => CancelTripBookingInput) data: CancelTripBookingInput
  ) {
    try {
      const trip = await Trip.findOne({
        where: { id: data.tripId },
        relations: { passengers: true },
      });

      if (!trip) {
        throw new Error("Le trajet n'existe pas");
      }

      if (!trip.passengers || trip.passengers.length === 0) {
        throw new Error("Ce trajet n'a pas de passagers");
      }

      const user = await User.findOne({
        where: { id: data.userId },
        relations: ["profile"],
      });

      console.log(user)
      
      if (!user) {
        throw new Error("L'utilisateur n'existe pas");
      }

      if (!user.profile) {
        throw new Error("L'utilisateur n'a pas de profil");
      }

      const isPassenger = trip.passengers.some(
        (passenger) => passenger.id === user.id
      );
      if (!isPassenger) {
        throw new Error("Vous n'avez pas réservé ce trajet");
      }

      trip.passengers = trip.passengers.filter(
        (passenger) => passenger.id !== user.id
      );

      if (trip.status === TripStatus.FULL) {
        trip.status = TripStatus.OPEN;
      }

      await trip.save();

      user.profile.cancelledTrips = user.profile.cancelledTrips ? user.profile.cancelledTrips += 1 : 1
      await user.save()

      return "Votre réservation a bien été annulée";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(
        "Une erreur est survenue lors de l'annulation de la réservation"
      );
    }
  }
}
