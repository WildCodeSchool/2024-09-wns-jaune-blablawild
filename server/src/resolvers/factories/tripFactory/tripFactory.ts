import { Trip } from "../../../entities/trip";
import { User } from "../../../entities/user";
import { Booking } from "../../../entities/booking";

export class TripFactory {
  private trip: Partial<Trip>;

  constructor() {
    this.trip = {
      id: "1",
      departure_city: "Paris",
      arrival_city: "Lyon",
      departure_time: new Date("2025-04-10T10:00:00Z"),
      price: 25,
      capacity: 4,
      driver: {
        id: "driver1",
        firstname: "John",
        lastname: "Doe",
      } as User,
      bookings: [],
    };
  }

  withId(id: string): TripFactory {
    return this.withOverride({ id });
  }

  withDriver(driver: User): TripFactory {
    return this.withOverride({ driver });
  }

  withBookings(bookings: Booking[]): TripFactory {
    return this.withOverride({ bookings });
  }

  // Méthode de compatibilité pour les anciens tests
  withPassengers(passengers: User[]): TripFactory {
    const bookings = passengers.map((passenger, index) => ({
      id: `booking-${index}`,
      passenger,
      seatsCount: 1,
      bookingDate: new Date(),
    })) as Booking[];
    
    return this.withOverride({ bookings });
  }

  withCapacity(capacity: number): TripFactory {
    return this.withOverride({ capacity });
  }

  withDepartureTime(departure_time: Date): TripFactory {
    return this.withOverride({ departure_time });
  }

  withPrice(price: number): TripFactory {
    return this.withOverride({ price });
  }

  private withOverride(override: Partial<Trip>): TripFactory {
    const factory = new TripFactory();
    factory.trip = { ...this.trip, ...override };
    return factory;
  }

  build(): Trip {
    return this.trip as Trip;
  }
}