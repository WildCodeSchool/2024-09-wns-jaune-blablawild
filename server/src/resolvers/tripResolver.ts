import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Between, FindOptionsWhere, ILike, LessThan, MoreThan } from "typeorm";
import { toZonedTime } from "date-fns-tz";
import { Trip } from "../entities/trip";
import { getHours, parseISO } from "date-fns";
import { User } from "../entities/user";
import { Booking } from "../entities/booking";
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

interface TripWithBookings extends Trip {
  bookings?: Booking[];
}

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
      const trips = (await Trip.find({
        where,
        order: orderBy,
        relations: {
          driver: true,
          bookings: {
            passenger: true,
          },
        },
      })) as TripWithBookings[];

      let filteredTrips = trips.filter((trip) => {
        const totalBookedSeats =
          trip.bookings?.reduce(
            (sum, booking) => sum + booking.seatsCount,
            0
          ) || 0;
        const availableSeats = trip.capacity - totalBookedSeats;
        return availableSeats >= data.passengers;
      });

     if (data.timeOptions && data.timeOptions.length > 0) {
        filteredTrips = filteredTrips.filter((trip) => {
          const departureDate = parseISO(trip.departure_time.toISOString());
          const zonedDate = toZonedTime(departureDate, 'Europe/Paris');
          const departureHour = getHours(zonedDate);

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
      relations: {
        driver: true,
        bookings: {
          passenger: true,
        },
      },
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
          bookings: {
            passenger: {
              id: userId,
            },
          },
        },
        relations: {
          bookings: {
            passenger: true,
          },
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
    }

    const trips = await Trip.find({
      where: whereClause,
      relations: {
        bookings: {
          passenger: true,
        },
        driver: true,
        reviews: {
          sender: true,
          receiver: true,
        },
      },
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
      relations: {
        bookings: {
          passenger: {
            profile: true,
          },
        },
        driver: {
          profile: true,
        },
      },
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
      const trip = (await Trip.findOne({
        where: { id: data.tripId },
        relations: {
          bookings: {
            passenger: true,
          },
          driver: true,
        },
      })) as TripWithBookings;

      if (!trip) throw new Error("Le trajet n'existe pas");

      if (trip.status === TripStatus.CLOSE) {
        throw new Error("Ce trajet n'est plus disponible");
      }

      const user = await User.findOneBy({ id: data.userId });
      if (!user) {
        throw new Error("L'utilisateur n'existe pas");
      }

      if (data.userId.toString() === trip.driver.id.toString()) {
        throw new Error(
          "Vous ne pouvez pas réserver un trajet pour lequel vous êtes conducteur"
        );
      }

      const existingBooking = trip.bookings?.find(
        (booking) => booking.passenger.id === user.id
      );
      if (existingBooking) {
        throw new Error("Vous avez déjà réservé ce trajet");
      }

      const seatsToBook = data.seatsCount || 1;
      const totalBookedSeats =
        trip.bookings?.reduce((sum, booking) => sum + booking.seatsCount, 0) ||
        0;
      const availableSeats = trip.capacity - totalBookedSeats;

      if (availableSeats < seatsToBook) {
        throw new Error(
          `Il ne reste pas assez de places disponibles. Places disponibles: ${availableSeats}`
        );
      }

      const booking = new Booking();
      booking.passenger = user;
      booking.trip = trip;
      booking.seatsCount = seatsToBook;
      booking.bookingDate = new Date();

      await booking.save();
      console.log("Booking créé:", booking);

      const newTotalBookedSeats = totalBookedSeats + seatsToBook;
      console.log("New total booked seats:", newTotalBookedSeats);

      if (newTotalBookedSeats >= trip.capacity) {
        trip.status = TripStatus.FULL;
        await trip.save();
        console.log("Trip status updated to FULL");
      }

      return "Votre réservation a bien été enregistrée";
    } catch (error) {
      console.error("Error in bookTrip:", error);
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
      const trip = (await Trip.findOne({
        where: { id: data.tripId },
        relations: {
          bookings: {
            passenger: true,
          },
        },
      })) as TripWithBookings;

      if (!trip) {
        throw new Error("Le trajet n'existe pas");
      }

      if (!trip.bookings || trip.bookings.length === 0) {
        throw new Error("Ce trajet n'a pas de réservations");
      }

      const user = await User.findOne({
        where: { id: data.userId },
        relations: ["profile"],
      });

      console.log(user);

      if (!user) {
        throw new Error("L'utilisateur n'existe pas");
      }

      if (!user.profile) {
        throw new Error("L'utilisateur n'a pas de profil");
      }

      const booking = trip.bookings.find(
        (booking) => booking.passenger.id === user.id
      );

      if (!booking) {
        throw new Error("Vous n'avez pas réservé ce trajet");
      }

      await Booking.remove(booking);

      if (trip.status === TripStatus.FULL) {
        trip.status = TripStatus.OPEN;
        await trip.save();
      }

      user.profile.cancelledTrips = user.profile.cancelledTrips
        ? user.profile.cancelledTrips + 1
        : 1;
      await user.save();

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
