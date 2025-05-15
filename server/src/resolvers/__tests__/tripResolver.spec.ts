import { faker } from "@faker-js/faker/locale/fr";
import { Trip } from "../../entities/trip";
import { User } from "../../entities/user";
import {
  BookTripInput,
  CancelTripBookingInput,
  CreateTripInput,
  FilterTripInput,
  SortOption,
  TimeOption,
  TripStatus,
  TripStatusFilter,
} from "../../type/tripType";
import { TripResolver } from "../tripResolver";

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
    const orderedTrips = [
      { ...createMockTrip(2, 30), price: 30, capacity: 5 },
      { ...createMockTrip(4, 32), price: 32, capacity: 5 },
      { ...createMockTrip(15, 45), price: 45, capacity: 5 },
      { ...createMockTrip(20, 50), price: 50, capacity: 5 },
    ];

    (Trip.find as jest.Mock).mockResolvedValue(orderedTrips);

    filterInput.passengers = 3;
    filterInput.sortBy = SortOption.PRICE;
    filterInput.timeOptions = [];

    const result = await tripResolver.getTrip(filterInput);

    expect(Trip.find).toHaveBeenCalledWith({
      where: expect.anything(),
      order: { price: "ASC" },
      relations: {
        driver: true,
        passengers: true,
      },
    });

    expect(result.length).toBeGreaterThan(0);

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
      jest.clearAllMocks(); 
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
      jest.clearAllMocks();
      
      const filteredTrips = trips.filter(
        (trip) => trip.driver?.id === driverId
      );
      (Trip.find as jest.Mock).mockResolvedValueOnce(filteredTrips);

      const result = await tripResolver.getTripByUser(
        driverId as string,
        filter,
        false
      );

      const findCalls = (Trip.find as jest.Mock).mock.calls;
      expect(findCalls.length).toBeGreaterThan(0);
      
      const lastCall = findCalls[findCalls.length - 1][0];
      
      if (driverId) {
        expect(lastCall.where.driver.id).toBe(driverId);
      }
      
      if (filter === TripStatusFilter.UPCOMING) {
        expect(lastCall.where.departure_time._type).toBe("moreThan");
      } else if (filter === TripStatusFilter.PAST) {
        expect(lastCall.where.departure_time._type).toBe("lessThan");
      }
      
      expect(lastCall.relations.passengers).toBe(true);
      expect(lastCall.relations.driver).toBe(true);
      
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(expectedLength);
    });
  });
});

describe("Trip Booking Tests", () => {
  let tripResolver: TripResolver;
  let mockTrip: Partial<Trip>;
  let mockUser: Partial<User>;

  beforeEach(() => {
    tripResolver = new TripResolver();

    mockUser = {
      id: faker.string.uuid(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
    };

    mockTrip = {
      id: faker.string.uuid(),
      departure_city: faker.location.city(),
      arrival_city: faker.location.city(),
      departure_time: faker.date.future(),
      price: faker.number.int({ min: 20, max: 100 }),
      capacity: 4,
      status: TripStatus.OPEN,
      passengers: [],
      save: jest.fn().mockResolvedValue(true),
    };

    jest.clearAllMocks();
  });

  describe("bookTrip", () => {
    it("devrait réserver un trajet avec succès", async () => {
      const bookingData: BookTripInput = {
        tripId: mockTrip.id!,
        userId: mockUser.id!,
      };

      (Trip.findOne as jest.Mock).mockResolvedValue(mockTrip);
      (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      const result = await tripResolver.bookTrip(bookingData);

      expect(result).toBe("Votre réservation a bien été enregistrée");
      expect(mockTrip.passengers).toContainEqual(mockUser);
      expect(mockTrip.save).toHaveBeenCalled();
    });

    it("devrait échouer si le trajet est complet", async () => {
      const fullTrip = {
        ...mockTrip,
        status: TripStatus.FULL,
      };

      (Trip.findOne as jest.Mock).mockResolvedValue(fullTrip);

      const bookingData: BookTripInput = {
        tripId: fullTrip.id!,
        userId: mockUser.id!,
      };

      await expect(tripResolver.bookTrip(bookingData)).rejects.toThrow(
        "Ce trajet est déjà complet"
      );
    });

    it("devrait échouer si pas assez de places disponibles", async () => {
      const tripWithPassengers = {
        ...mockTrip,
        capacity: 2,
        passengers: [{ id: faker.string.uuid() }, { id: faker.string.uuid() }],
      };

      (Trip.findOne as jest.Mock).mockResolvedValue(tripWithPassengers);
      (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      const bookingData: BookTripInput = {
        tripId: tripWithPassengers.id!,
        userId: mockUser.id!,
      };

      await expect(tripResolver.bookTrip(bookingData)).rejects.toThrow(
        "Il ne reste pas assez de places disponibles"
      );
    });

    it("devrait échouer si l'utilisateur a déjà réservé", async () => {
      const tripWithUser = {
        ...mockTrip,
        passengers: [mockUser],
      };

      (Trip.findOne as jest.Mock).mockResolvedValue(tripWithUser);
      (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      const bookingData: BookTripInput = {
        tripId: tripWithUser.id!,
        userId: mockUser.id!,
      };

      await expect(tripResolver.bookTrip(bookingData)).rejects.toThrow(
        "Vous avez déjà réservé ce trajet"
      );
    });
  });

  describe("cancelTripBooking", () => {
    it("devrait annuler une réservation avec succès", async () => {
      const tripWithUser = {
        ...mockTrip,
        passengers: [mockUser],
        save: jest.fn().mockResolvedValue(true),
      };

      (Trip.findOne as jest.Mock).mockResolvedValue(tripWithUser);
      (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      const cancelData: CancelTripBookingInput = {
        tripId: tripWithUser.id!,
        userId: mockUser.id!,
      };

      const result = await tripResolver.cancelTripBooking(cancelData);

      expect(result).toBe("Votre réservation a bien été annulée");
      expect(tripWithUser.passengers).not.toContainEqual(mockUser);
      expect(tripWithUser.save).toHaveBeenCalled();
    });

    it("devrait échouer si l'utilisateur n'a pas réservé", async () => {
      const tripWithoutUser = {
        ...mockTrip,
        passengers: [{ id: faker.string.uuid() }],
      };

      (Trip.findOne as jest.Mock).mockResolvedValue(tripWithoutUser);
      (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      const cancelData: CancelTripBookingInput = {
        tripId: tripWithoutUser.id!,
        userId: mockUser.id!,
      };

      await expect(tripResolver.cancelTripBooking(cancelData)).rejects.toThrow(
        "Vous n'avez pas réservé ce trajet"
      );
    });

    it("devrait mettre à jour le statut de FULL à OPEN après annulation", async () => {
      const fullTrip = {
        ...mockTrip,
        status: TripStatus.FULL,
        capacity: 1,
        passengers: [mockUser],
        save: jest.fn().mockResolvedValue(true),
      };

      (Trip.findOne as jest.Mock).mockResolvedValue(fullTrip);
      (User.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      const cancelData: CancelTripBookingInput = {
        tripId: fullTrip.id!,
        userId: mockUser.id!,
      };

      await tripResolver.cancelTripBooking(cancelData);

      expect(fullTrip.status).toBe(TripStatus.OPEN);
      expect(fullTrip.save).toHaveBeenCalled();
    });
  });
});