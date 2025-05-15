import { BaseFactory, FactoryOptions } from "../baseFactory";
import { Trip } from "../../../entities/trip";
import { TripStatus } from "../../../type/tripType";
import { User } from "../../../entities/user";

export class TripFactory extends BaseFactory<Trip> {
  private overrides: Partial<Trip> = {};

  protected defineEntity(): Trip {
    return {
      id: this.faker.string.uuid(),
      departure_city: this.faker.location.city(),
      arrival_city: this.faker.location.city(),
      departure_time: this.faker.date.future(),
      price: this.faker.number.int({ min: 5, max: 100 }),
      capacity: this.faker.number.int({ min: 1, max: 5 }),
      status: TripStatus.OPEN,
      passengers: [] as User[],
    } as Trip;
  }

  withDriver(driver: any): this {
    return this.withOverride({ driver });
  }

  withPassengers(passengers: any[]): this {
    return this.withOverride({ passengers });
  }

  withStatus(status: TripStatus): this {
    return this.withOverride({ status });
  }

  withDepartureCity(city: string): this {
    return this.withOverride({ departure_city: city });
  }

  withArrivalCity(city: string): this {
    return this.withOverride({ arrival_city: city });
  }

  withPrice(price: number): this {
    return this.withOverride({ price });
  }

  withCapacity(capacity: number): this {
    return this.withOverride({ capacity });
  }

  withOverride(override: Partial<Trip>): this {
    this.overrides = { ...this.overrides, ...override };
    return this;
  }

  async build(options: FactoryOptions<Trip> = {}): Promise<Trip> {
    const mergedOptions = {
      ...options,
      override: {
        ...this.overrides,
        ...options.override,
      },
    };

    this.overrides = {};

    return super.build(mergedOptions);
  }

  protected async persist(entity: Trip): Promise<any | Trip> {
    const mockedTrip = {
      ...entity,
      save: jest.fn().mockResolvedValue(undefined),
    };

    (Trip as unknown as jest.Mock).mockImplementationOnce(function () {
      return mockedTrip;
    });

    return mockedTrip;
  }
}

export const tripFactory = new TripFactory
