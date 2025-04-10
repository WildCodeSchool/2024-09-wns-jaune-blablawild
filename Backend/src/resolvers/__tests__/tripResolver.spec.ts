import { faker } from "@faker-js/faker";
import { Trip } from "../../entities/trip";
import { TripResolver } from "../tripResolver";
import { FilterTripInput, SortOption, TimeOption } from "../../type/tripType";

jest.mock("../../entities/trip");

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

    const prices = result.map((trip) => trip.price)

    expect(result.length).toBe(3);
    expect(prices[0]).toBeLessThanOrEqual(prices[1]);
    expect(prices[1]).toBeLessThanOrEqual(prices[2]);
  });
  
});


