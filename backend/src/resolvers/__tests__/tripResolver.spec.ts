import { faker } from "@faker-js/faker/locale/fr";
import { TripResolver } from "../tripResolver";
import { Trip } from "../../entities/trip";
import { User } from "../../entities/user";
import {
  CreateTripInput,
  TripStatus,
  TripStatusFilter,
  FilterTripInput,
  SortOption,
  TimeOption,
} from "../../type/tripType";

jest.mock("../../entities/trip");
jest.mock("../../entities/user");

const generateTrip = () => {
  return {
    departure_city: faker.location.city(),
    arrival_city: faker.location.city(),
    departure_time: faker.date.future(),
    price: faker.number.int(),
    capacity: faker.number.int({ min: 1, max: 10 }),
    driverId: faker.string.uuid(),
    status: TripStatus.OPEN,
  };
};

describe("Filters trip tests", () => {
  let tripResolver: TripResolver;
  let filterInput: FilterTripInput;
  let mockTrips: Partial<Trip>[];

  const createMockTrip = (hour: number, price?: number) => ({
    id: faker.string.uuid(),
    departure_city: faker.location.city(),
    arrival_city: faker.location.city(),
    departure_time: new Date(
      `2025-04-10T${hour.toString().padStart(2, "0")}:00:00Z`
    ),
    price: price || faker.number.int({ min: 20, max: 100 }),
    capacity: faker.number.int({ min: 2, max: 6 }),
    passengers: [],
  });

  beforeEach(() => {
    tripResolver = new TripResolver();

    const startDate = new Date("2025-04-10T00:00:00Z");
    const endDate = new Date("2025-04-11T00:00:00Z");

    filterInput = {
      departure: faker.location.city(),
      arrival: faker.location.city(),
      startDate: startDate,
      endDate: endDate,
      passengers: faker.number.int(),
      timeOptions: [],
      sortBy: undefined,
    };
    jest.clearAllMocks();

    mockTrips = [
      createMockTrip(2, 50),
      createMockTrip(4, 30),
      createMockTrip(15, 45),
      createMockTrip(20, 32),
    ];
  });

  //it should sort trips by cheapest price
  it("should filter trips by cheapest price", async () => {
    const sortedTrips = [...mockTrips].sort(
      (a, b) => (a.price as number) - (b.price as number)
    );
    (Trip.find as jest.Mock).mockResolvedValue(sortedTrips);

    filterInput.sortBy = SortOption.PRICE;

    const result = await tripResolver.getTrip(filterInput);

    expect(Trip.find).toHaveBeenCalledWith({
      where: expect.anything(),
      order: { price: "ASC" },
      relations: {
        driver: true,
        passengers: true,
      },
    });
    const prices = result.map((trip) => trip.price as number);
    expect(prices[0]).toBeLessThanOrEqual(prices[1]);
    expect(prices[1]).toBeLessThanOrEqual(prices[2]);
    expect(prices[2]).toBeLessThanOrEqual(prices[3]);
  });

  //it should sort trips by earliest hours

  it("should filter trips by earliest hours", async () => {
    (Trip.find as jest.Mock).mockResolvedValue(mockTrips);

    filterInput.sortBy = SortOption.TIME;

    const result = await tripResolver.getTrip(filterInput);

    expect(Trip.find).toHaveBeenCalledWith({
      where: expect.anything(),
      order: { departure_time: "ASC" },
      relations: {
        driver: true,
        passengers: true,
      },
    });
    const hours = result.map((trip) => trip.departure_time.getUTCHours());
    expect(hours).toEqual([...hours].sort((a, b) => a - b));
  });

  //it should filter by time range
  it("should filter by time range", async () => {
    (Trip.find as jest.Mock).mockResolvedValue(mockTrips);

    filterInput.timeOptions = [TimeOption.Before_6, TimeOption.From_12To_18];

    const result = await tripResolver.getTrip(filterInput);

    expect(Trip.find).toHaveBeenCalledWith({
      where: expect.anything(),
      order: expect.anything(),
      relations: {
        driver: true,
        passengers: true,
      },
    });
    expect(result.length).toBe(3);
  });

  //it should filter by timerange and cheapest price
  it("should filter by time range and cheapest price", async () => {
    const sortedTrips = [...mockTrips].sort(
      (a, b) => (a.price as number) - (b.price as number)
    );
    (Trip.find as jest.Mock).mockResolvedValue(sortedTrips);

    filterInput.timeOptions = [TimeOption.Before_6, TimeOption.From_12To_18];
    filterInput.sortBy = SortOption.PRICE;

    const result = await tripResolver.getTrip(filterInput);

    expect(Trip.find).toHaveBeenCalledWith({
      where: expect.anything(),
      order: { price: "ASC" },
      relations: {
        driver: true,
        passengers: true,
      },
    });

    const prices = result.map((trip) => trip.price);

    expect(result.length).toBe(3);
    expect(prices[0]).toBeLessThanOrEqual(prices[1]);
    expect(prices[1]).toBeLessThanOrEqual(prices[2]);
  });
});

describe("Trip Resolver", () => {
  let tripResolver: TripResolver;
  let newTrip: CreateTripInput;

  describe("Trip Resolver", () => {
    let tripResolver: TripResolver;
    let newTrip: CreateTripInput;
    const today = new Date();
    const upcomingDate = today.setDate(today.getDate() + 3);
    const pastDate = today.setDate(today.getDate() - 3);

    beforeEach(() => {
      tripResolver = new TripResolver();

      newTrip = generateTrip();
    });

    it("should create a trip", async () => {
      const user = {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      (User.findOneBy as jest.Mock).mockResolvedValueOnce({
        id: newTrip.driverId,
        ...user,
      });
      (Trip.save as jest.Mock).mockResolvedValueOnce(newTrip);

      const result = await tripResolver.createTrip(newTrip);

      expect(result).toBe("Le trajet a bien été créé");
    });

    it.each([
      {
        name: "Get trips for given driverId",
        trips: [
          {
            ...generateTrip(),
            driver: { id: "3" },
          },
          {
            ...generateTrip(),
            driver: { id: "3" },
          },
          {
            ...generateTrip(),
            driver: { id: "1" },
          },
        ],
        expectedLength: 2,
        driverId: "3",
        filter: TripStatusFilter.PUBLISHED,
      },
      {
        name: "Get trips for given filter",
        trips: [
          {
            ...generateTrip(),
            driver: { id: "3" },
            departure_time: upcomingDate,
          },
          {
            ...generateTrip(),
            driver: { id: "3" },
            departure_time: pastDate,
          },
          {
            ...generateTrip(),
            driver: { id: "1" },
            departure_time: pastDate,
          },
        ],
        expectedLength: 2,
        driverId: "3",
        filter: TripStatusFilter.UPCOMING,
      },
      {
        name: "Get no trip when no driverId",
        trips: [
          {
            ...generateTrip(),
            driver: { id: "3" },
          },
          {
            ...generateTrip(),
            driver: { id: "3" },
          },
          {
            ...generateTrip(),
            driver: { id: "1" },
          },
        ],
        expectedLength: 0,
        driverId: null,
        filter: TripStatusFilter.PUBLISHED,
      },
    ])("$name", async ({ name, trips, expectedLength, driverId, filter }) => {
      const filteredTrips = trips.filter(
        (trip) => trip.driver?.id === driverId
      );
      (Trip.find as jest.Mock).mockResolvedValueOnce(filteredTrips);

      const result = await tripResolver.getTripByUser(
        driverId as string,
        filter
      );

      interface WhereClause {
        driver: { id: string | null };
        departure_time?: any;
      }

      const expectedWhere: WhereClause = {
        driver: { id: driverId },
      };

      if (filter === TripStatusFilter.UPCOMING) {
        expectedWhere.departure_time = expect.objectContaining({
          _type: "moreThan",
        });
      } else if (filter === TripStatusFilter.PAST) {
        expectedWhere.departure_time = expect.objectContaining({
          _type: "lessThan",
        });
      }

      expect(Trip.find).toHaveBeenCalledWith({
        where: expectedWhere,
        relations: {
          passengers: true,
          driver: true,
        },
      });
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(expectedLength);
    });
  });
});
