import { CreateTripInput, TripStatus } from "../../../type/tripType";
import { BaseFactory, FactoryOptions } from "../baseFactory";

export class CreateTripInputFactory extends BaseFactory<CreateTripInput> {
  protected defineEntity(): CreateTripInput {
    return {
      departure_city: this.faker.location.city(),
      arrival_city: this.faker.location.city(),
      departure_time: this.faker.date.future(),
      price: this.faker.number.int({ min: 5, max: 100 }),
      capacity: this.faker.number.int({ min: 1, max: 5 }),
      driverId: this.faker.string.uuid(),
    }
  }

  // set specific driverId
  withDriverId(driverId: string): this {
    return this.withOverride({driverId})
  }

  //set capacity
  withCapacity(capacity: number): this {
    return this.withOverride({capacity})
  }

  //specific date time 
  withDepartureTime(date: Date): this {
    return this.withOverride({departure_time: date})
  }

  // set specific price 
  withPrice(price: number) : this {
    return this.withOverride({price})
  }

  private overrides: Partial<CreateTripInput> = {}

  withOverride(override: Partial<CreateTripInput>): this {
    this.overrides = {...this.overrides, ...override}
    return this
  }

    async build(options: FactoryOptions<CreateTripInput> = {}): Promise<CreateTripInput> {
        const mergedOptions = {
            ...options,
            override: {
                ...this.overrides,
                ...options.override
            }
        }

        this.overrides = {}

        return await super.build(mergedOptions)
    }

    // permet de garder les données fait semblant de faire un save par ex
    protected async persist(entity: CreateTripInput): Promise<CreateTripInput> {
        return entity
    }

}

export const createTripInputFactory = new CreateTripInput()
