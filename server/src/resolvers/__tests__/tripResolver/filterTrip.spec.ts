import { faker } from "@faker-js/faker/locale/fr";
import { Trip } from "../../../entities/trip";
import { Booking } from "../../../entities/booking";
import {
  FilterTripInput,
  SortOption,
  TimeOption,
  TripStatus,
} from "../../../type/tripType";
import { TripResolver } from "../../tripResolver";

// Ne pas mocker les entités au niveau global
describe("Filters trip tests", () => {
  let tripResolver: TripResolver;
  let filterInput: FilterTripInput;
  let mockTrips: Partial<Trip>[];

  const createMockTrip = (hour: number, price?: number, bookedSeats = 0): Partial<Trip> => ({
    id: faker.string.uuid(),
    departure_city: faker.location.city(),
    arrival_city: faker.location.city(),
    departure_address: faker.location.streetAddress(),
    arrival_address: faker.location.streetAddress(),
    departure_time: new Date(
      `2025-04-10T${hour.toString().padStart(2, "0")}:00:00Z`
    ),
    price: price || faker.number.int({ min: 20, max: 100 }),
    capacity: faker.number.int({ min: 2, max: 6 }),
    reservedSeats: 0,
    status: TripStatus.OPEN,
    driver: {
      id: faker.string.uuid(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
    } as any,
    bookings: Array.from({ length: bookedSeats }, (_, i) => ({
      id: `booking-${i}`,
      seatsCount: 1,
      passenger: { 
        id: `passenger-${i}`,
        firstname: `Passenger${i}`,
      } as any,
      bookingDate: new Date(),
    })) as any,
    reviews: [],
    transactions: [],
  });

  beforeEach(() => {
    tripResolver = new TripResolver();

    const startDate = new Date("2025-04-10T00:00:00Z");
    const endDate = new Date("2025-04-11T00:00:00Z");

    filterInput = {
      departure: "Paris",
      arrival: "Lyon",
      startDate: startDate,
      endDate: endDate,
      passengers: 1,
      timeOptions: [],
      sortBy: undefined,
    };

    // Mock des méthodes statiques
    Trip.find = jest.fn();
    
    jest.clearAllMocks();

    mockTrips = [
      createMockTrip(2, 50, 1),
      createMockTrip(4, 30, 0),
      createMockTrip(15, 45, 2),
      createMockTrip(20, 32, 1),
    ];
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should filter trips by cheapest price", async () => {
    const orderedTrips = [
      { ...createMockTrip(2, 30, 1), price: 30, capacity: 5 },
      { ...createMockTrip(4, 32, 0), price: 32, capacity: 5 },
      { ...createMockTrip(15, 45, 1), price: 45, capacity: 5 },
      { ...createMockTrip(20, 50, 0), price: 50, capacity: 5 },
    ];

    (Trip.find as jest.Mock).mockResolvedValue(orderedTrips);

    filterInput.passengers = 3;
    filterInput.sortBy = SortOption.PRICE;
    filterInput.timeOptions = [];

    const result = await tripResolver.getTrip(filterInput);

    expect(Trip.find).toHaveBeenCalledWith({
      where: expect.objectContaining({
        departure_city: expect.anything(),
        arrival_city: expect.anything(),
        departure_time: expect.anything(),
      }),
      order: { price: "ASC" },
      relations: {
        driver: true,
        bookings: {
          passenger: true,
        },
      },
    });

    expect(result.length).toBeGreaterThan(0);

    // Vérifier que les prix sont triés par ordre croissant
    const prices = result.map((trip) => trip.price as number);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  it("should filter trips by earliest hours", async () => {
    // Créer des trips avec des heures spécifiques pour le test
    const timeOrderedTrips = [
      createMockTrip(2, 50, 1),
      createMockTrip(4, 30, 0),
      createMockTrip(15, 45, 1),
      createMockTrip(20, 32, 0),
    ];

    (Trip.find as jest.Mock).mockResolvedValue(timeOrderedTrips);

    filterInput.sortBy = SortOption.TIME;

    const result = await tripResolver.getTrip(filterInput);

    expect(Trip.find).toHaveBeenCalledWith({
      where: expect.objectContaining({
        departure_city: expect.anything(),
        arrival_city: expect.anything(),
        departure_time: expect.anything(),
      }),
      order: { departure_time: "ASC" },
      relations: {
        driver: true,
        bookings: {
          passenger: true,
        },
      },
    });

    // Vérifier que les heures sont triées par ordre croissant
    const hours = result.map((trip) => trip.departure_time.getUTCHours());
    for (let i = 0; i < hours.length - 1; i++) {
      expect(hours[i]).toBeLessThanOrEqual(hours[i + 1]);
    }
  });

  it("should filter by time range", async () => {
    const tripsWithVariousHours = [
      createMockTrip(2, 50, 1),   // Before_6
      createMockTrip(4, 30, 0),   // Before_6
      createMockTrip(8, 45, 1),   // From_6To_12 (ne devrait pas être inclus)
      createMockTrip(15, 32, 0),  // From_12To_18
      createMockTrip(20, 40, 1),  // After_18 (ne devrait pas être inclus)
    ];

    (Trip.find as jest.Mock).mockResolvedValue(tripsWithVariousHours);

    filterInput.timeOptions = [TimeOption.Before_6, TimeOption.From_12To_18];

    const result = await tripResolver.getTrip(filterInput);

    expect(Trip.find).toHaveBeenCalledWith({
      where: expect.objectContaining({
        departure_city: expect.anything(),
        arrival_city: expect.anything(),
        departure_time: expect.anything(),
      }),
      order: {},
      relations: {
        driver: true,
        bookings: {
          passenger: true,
        },
      },
    });

    // Vérifier que seuls les trips avec les bonnes heures sont retournés
    const hours = result.map((trip) => trip.departure_time.getUTCHours());
    hours.forEach(hour => {
      expect(hour < 6 || (hour >= 12 && hour < 18)).toBe(true);
    });
  });

  it("should filter by time range and maintain price order", async () => {
    // Données triées par prix (comme retournées par la base de données)
    const tripsWithVariousHours = [
      createMockTrip(4, 25, 0),   // Before_6 - Prix: 25
      createMockTrip(2, 30, 1),   // Before_6 - Prix: 30
      createMockTrip(20, 35, 1),  // After_18 - Prix: 35 (sera filtré)
      createMockTrip(15, 40, 1),  // From_12To_18 - Prix: 40
      createMockTrip(8, 45, 1),   // From_6To_12 - Prix: 45 (sera filtré)
      createMockTrip(16, 50, 1),  // From_12To_18 - Prix: 50
    ];

    (Trip.find as jest.Mock).mockResolvedValue(tripsWithVariousHours);

    filterInput.timeOptions = [TimeOption.Before_6, TimeOption.From_12To_18];
    filterInput.sortBy = SortOption.PRICE;

    const result = await tripResolver.getTrip(filterInput);

    expect(Trip.find).toHaveBeenCalledWith({
      where: expect.objectContaining({
        departure_city: expect.anything(),
        arrival_city: expect.anything(),
        departure_time: expect.anything(),
      }),
      order: { price: "ASC" },
      relations: {
        driver: true,
        bookings: {
          passenger: true,
        },
      },
    });

    // Vérifier que les trips sont filtrés par heure
    const hours = result.map((trip) => trip.departure_time.getUTCHours());
    hours.forEach(hour => {
      expect(hour < 6 || (hour >= 12 && hour < 18)).toBe(true);
    });

    // Vérifier que nous avons les bons trips
    expect(result.length).toBe(4); // 2 Before_6 + 2 From_12To_18
    
    // Vérifier que l'ordre des prix est maintenu après filtrage
    // L'ordre devrait être: 25, 30, 40, 50 (trips filtrés mais ordre préservé)
    const prices = result.map((trip) => trip.price as number);
    expect(prices).toEqual([25, 30, 40, 50]);
  });

  it("should filter trips by available seats", async () => {
    const tripsWithDifferentCapacity = [
      { ...createMockTrip(10, 50, 1), capacity: 4 }, // 3 places disponibles
      { ...createMockTrip(11, 30, 3), capacity: 4 }, // 1 place disponible
      { ...createMockTrip(12, 45, 4), capacity: 4 }, // 0 places disponibles
      { ...createMockTrip(13, 32, 0), capacity: 4 }, // 4 places disponibles
    ];

    (Trip.find as jest.Mock).mockResolvedValue(tripsWithDifferentCapacity);

    filterInput.passengers = 2; // Besoin de 2 places

    const result = await tripResolver.getTrip(filterInput);

    // Seuls les trips avec au moins 2 places disponibles devraient être retournés
    expect(result.length).toBe(2); // trips avec 3 et 4 places disponibles
    
    result.forEach(trip => {
      const totalBookedSeats = trip.bookings?.reduce((sum, booking) => sum + booking.seatsCount, 0) || 0;
      const availableSeats = trip.capacity - totalBookedSeats;
      expect(availableSeats).toBeGreaterThanOrEqual(2);
    });
  });

  it("should handle empty time options", async () => {
    const mockTrips = [
      createMockTrip(2, 50, 1),
      createMockTrip(15, 30, 0),
    ];

    (Trip.find as jest.Mock).mockResolvedValue(mockTrips);

    filterInput.timeOptions = [];

    const result = await tripResolver.getTrip(filterInput);

    // Quand timeOptions est vide, tous les trips devraient être retournés (sans filtre d'heure)
    expect(result.length).toBe(2);
  });

  it("should handle null/undefined timeOptions", async () => {
    const mockTrips = [
      createMockTrip(2, 50, 1),
      createMockTrip(15, 30, 0),
    ];

    (Trip.find as jest.Mock).mockResolvedValue(mockTrips);

    filterInput.timeOptions = undefined;

    const result = await tripResolver.getTrip(filterInput);

    // Quand timeOptions est undefined, tous les trips devraient être retournés
    expect(result.length).toBe(2);
  });

  it("should handle no available seats", async () => {
    const tripsWithNoAvailableSeats = [
      { ...createMockTrip(10, 50, 4), capacity: 4 }, // 0 places disponibles
      { ...createMockTrip(11, 30, 5), capacity: 4 }, // -1 places disponibles (surréservé)
    ];

    (Trip.find as jest.Mock).mockResolvedValue(tripsWithNoAvailableSeats);

    filterInput.passengers = 1;

    const result = await tripResolver.getTrip(filterInput);

    // Aucun trip ne devrait être retourné car aucune place disponible
    expect(result.length).toBe(0);
  });
});