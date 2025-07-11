// src/resolvers/__tests__/tripResolver/bookTrip.spec.ts
import { TripResolver } from "../../tripResolver";
import { Trip } from "../../../entities/trip";
import { User } from "../../../entities/user";
import { Booking } from "../../../entities/booking";
import { BookTripInput, TripStatus } from "../../../type/tripType";

describe("bookTrip", () => {
  let tripResolver: TripResolver;
  let mockTrip: Trip;
  let mockUser: User;

  beforeEach(() => {
    tripResolver = new TripResolver();

    // Nettoyer tous les mocks
    jest.clearAllMocks();
    
    mockTrip = {
      id: "1",
      capacity: 4,
      status: TripStatus.OPEN,
      driver: { id: "driver1" } as User,
      bookings: [],
      save: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockUser = {
      id: "user1",
      firstname: "John",
      lastname: "Doe",
    } as User;

    // Mock des méthodes statiques - uniquement celles utilisées dans bookTrip
    Trip.findOne = jest.fn().mockResolvedValue(mockTrip);
    User.findOneBy = jest.fn().mockResolvedValue(mockUser);
    
    // Mock du constructeur et de la méthode save de Booking
    jest.spyOn(Booking.prototype, 'save').mockResolvedValue(undefined as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully book a trip", async () => {
    const bookingInput: BookTripInput = {
      tripId: "1",
      userId: "user1",
      seatsCount: 2,
    };

    const result = await tripResolver.bookTrip(bookingInput);

    expect(result).toBe("Votre réservation a bien été enregistrée");
    
    // Vérifications des appels
    expect(Trip.findOne).toHaveBeenCalledWith({
      where: { id: "1" },
      relations: { 
        bookings: { 
          passenger: true 
        }, 
        driver: true 
      },
    });
    
    expect(User.findOneBy).toHaveBeenCalledWith({ id: "user1" });
    
    // Vérifier que le booking est sauvegardé
    expect(Booking.prototype.save).toHaveBeenCalled();
    
    // Vérifier que le trip n'est pas sauvegardé (pas encore plein)
    expect(mockTrip.save).not.toHaveBeenCalled();
  });

  it("should throw error if user already has a booking", async () => {
    const existingBooking = {
      id: "existing-booking",
      passenger: mockUser, // Même utilisateur
      trip: mockTrip,
      seatsCount: 1,
    };

    // Modifier directement mockTrip
    mockTrip.bookings = [existingBooking] as any;
    
    Trip.findOne = jest.fn().mockResolvedValue(mockTrip);

    const bookingInput: BookTripInput = {
      tripId: "1",
      userId: "user1",
      seatsCount: 1,
    };

    await expect(tripResolver.bookTrip(bookingInput)).rejects.toThrow(
      "Vous avez déjà réservé ce trajet"
    );
    
    // Vérifier que save n'a pas été appelé
    expect(Booking.prototype.save).not.toHaveBeenCalled();
  });

  it("should throw error if not enough seats available", async () => {
    const existingBookings = [
      { 
        id: "booking1",
        seatsCount: 3, 
        passenger: { id: "other-user" },
        trip: mockTrip,
        bookingDate: new Date(),
      },
      { 
        id: "booking2",
        seatsCount: 1, 
        passenger: { id: "another-user" },
        trip: mockTrip,
        bookingDate: new Date(),
      },
    ];

    // Modifier directement mockTrip
    mockTrip.bookings = existingBookings as any;
    
    Trip.findOne = jest.fn().mockResolvedValue(mockTrip);

    const bookingInput: BookTripInput = {
      tripId: "1",
      userId: "user1",
      seatsCount: 2,
    };

    await expect(tripResolver.bookTrip(bookingInput)).rejects.toThrow(
      "Il ne reste pas assez de places disponibles"
    );
  });

  it("should throw error if trip does not exist", async () => {
    Trip.findOne = jest.fn().mockResolvedValue(null);

    const bookingInput: BookTripInput = {
      tripId: "1",
      userId: "user1",
      seatsCount: 1,
    };

    await expect(tripResolver.bookTrip(bookingInput)).rejects.toThrow(
      "Le trajet n'existe pas"
    );
  });

  it("should throw error if user does not exist", async () => {
    User.findOneBy = jest.fn().mockResolvedValue(null);

    const bookingInput: BookTripInput = {
      tripId: "1",
      userId: "user1",
      seatsCount: 1,
    };

    await expect(tripResolver.bookTrip(bookingInput)).rejects.toThrow(
      "L'utilisateur n'existe pas"
    );
  });

  it("should throw error if user tries to book their own trip", async () => {
    // Modifier le mockTrip pour que le driver soit le même que l'utilisateur
    const mockTripWithSameDriver = {
      ...mockTrip,
      driver: { id: "user1" } as User
    };
    
    Trip.findOne = jest.fn().mockResolvedValue(mockTripWithSameDriver);

    const bookingInput: BookTripInput = {
      tripId: "1",
      userId: "user1",
      seatsCount: 1,
    };

    await expect(tripResolver.bookTrip(bookingInput)).rejects.toThrow(
      "Vous ne pouvez pas réserver un trajet pour lequel vous êtes conducteur"
    );
  });

  it("should throw error if trip is already full", async () => {
    const mockFullTrip = {
      ...mockTrip,
      status: TripStatus.FULL
    };
    
    Trip.findOne = jest.fn().mockResolvedValue(mockFullTrip);

    const bookingInput: BookTripInput = {
      tripId: "1",
      userId: "user1",
      seatsCount: 1,
    };

    await expect(tripResolver.bookTrip(bookingInput)).rejects.toThrow(
      "Ce trajet est déjà complet"
    );
  });

  it("should throw error if trip is closed", async () => {
    const mockClosedTrip = {
      ...mockTrip,
      status: TripStatus.CLOSE
    };
    
    Trip.findOne = jest.fn().mockResolvedValue(mockClosedTrip);

    const bookingInput: BookTripInput = {
      tripId: "1",
      userId: "user1",
      seatsCount: 1,
    };

    await expect(tripResolver.bookTrip(bookingInput)).rejects.toThrow(
      "Ce trajet n'est plus disponible"
    );
  });

  it("should update trip status to FULL when capacity is reached", async () => {
    const existingBookings = [
      { 
        id: "booking1",
        seatsCount: 3, 
        passenger: { id: "other-user" },
        trip: mockTrip,
        bookingDate: new Date(),
      },
    ];

    // Modifier directement mockTrip au lieu de créer une copie
    mockTrip.bookings = existingBookings as any;
    
    Trip.findOne = jest.fn().mockResolvedValue(mockTrip);

    const bookingInput: BookTripInput = {
      tripId: "1",
      userId: "user1",
      seatsCount: 1, // 3 + 1 = 4 (capacité complète)
    };

    const result = await tripResolver.bookTrip(bookingInput);

    expect(result).toBe("Votre réservation a bien été enregistrée");
    
    // Vérifier que le booking est créé
    expect(Booking.prototype.save).toHaveBeenCalled();
    
    // Vérifier que le statut du trip est mis à jour et sauvegardé
    expect(mockTrip.status).toBe(TripStatus.FULL);
    expect(mockTrip.save).toHaveBeenCalled();
  });

  it("should use default seats count of 1 if not provided", async () => {
    const bookingInput: BookTripInput = {
      tripId: "1",
      userId: "user1",
      // seatsCount non fourni
    };

    const result = await tripResolver.bookTrip(bookingInput);

    expect(result).toBe("Votre réservation a bien été enregistrée");
    
    // Vérifier que le booking est créé
    expect(Booking.prototype.save).toHaveBeenCalled();
  });
});