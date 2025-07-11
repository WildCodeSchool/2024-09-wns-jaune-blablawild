import { faker } from "@faker-js/faker/locale/fr";
import { Trip } from "../../../entities/trip";
import { User } from "../../../entities/user";
import { Booking } from "../../../entities/booking";
import { CancelTripBookingInput, TripStatus } from "../../../type/tripType";
import { TripResolver } from "../../tripResolver";
import { TripFactory, userFactory } from "../../factories";

describe("cancelTripBooking", () => {
  let tripResolver: TripResolver;
  let mockTrip: Trip;
  let mockUser: User;
  let mockBooking: any;

  beforeEach(async () => {
    tripResolver = new TripResolver();
    
    const tripFactory = new TripFactory();
    mockTrip = tripFactory.build();
    mockUser = await userFactory.withProfile().build();
    
    mockBooking = {
      id: faker.string.uuid(),
      passenger: mockUser,
      trip: mockTrip,
      seatsCount: 1,
      bookingDate: new Date(),
    };
    
    Trip.findOne = jest.fn();
    User.findOne = jest.fn();
    Booking.remove = jest.fn();
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("devrait annuler une réservation avec succès", async () => {
    const tripWithBooking = {
      ...mockTrip,
      bookings: [mockBooking],
      save: jest.fn().mockResolvedValue(true),
    };

    const userWithProfile = {
      ...mockUser,
      profile: {
        ...mockUser.profile,
        cancelledTrips: 0
      },
      save: jest.fn().mockResolvedValue(true),
    };

    (Trip.findOne as jest.Mock).mockResolvedValue(tripWithBooking);
    (User.findOne as jest.Mock).mockResolvedValue(userWithProfile);
    (Booking.remove as jest.Mock).mockResolvedValue(true);

    const cancelData: CancelTripBookingInput = {
      tripId: mockTrip.id!,
      userId: mockUser.id!,
    };

    const result = await tripResolver.cancelTripBooking(cancelData);

    expect(result).toBe("Votre réservation a bien été annulée");
    expect(Booking.remove).toHaveBeenCalledWith(mockBooking);
    expect(userWithProfile.profile.cancelledTrips).toBe(1);
    expect(userWithProfile.save).toHaveBeenCalled();
    
    // Vérifier les appels aux méthodes findOne
    expect(User.findOne).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      relations: ["profile"]
    });
    expect(Trip.findOne).toHaveBeenCalledWith({
      where: { id: mockTrip.id },
      relations: { 
        bookings: { 
          passenger: true 
        } 
      }
    });
  });

  it("devrait échouer si le trajet n'existe pas", async () => {
    (Trip.findOne as jest.Mock).mockResolvedValue(null);

    const cancelData: CancelTripBookingInput = {
      tripId: mockTrip.id!,
      userId: mockUser.id!,
    };

    await expect(tripResolver.cancelTripBooking(cancelData)).rejects.toThrow(
      "Le trajet n'existe pas"
    );
  });

  it("devrait échouer si l'utilisateur n'existe pas", async () => {
    const tripWithBooking = {
      ...mockTrip,
      bookings: [mockBooking],
    };

    (Trip.findOne as jest.Mock).mockResolvedValue(tripWithBooking);
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const cancelData: CancelTripBookingInput = {
      tripId: mockTrip.id!,
      userId: mockUser.id!,
    };

    await expect(tripResolver.cancelTripBooking(cancelData)).rejects.toThrow(
      "L'utilisateur n'existe pas"
    );
  });

  it("devrait échouer si l'utilisateur n'a pas de profil", async () => {
    const tripWithBooking = {
      ...mockTrip,
      bookings: [mockBooking],
    };

    const userWithoutProfile = {
      ...mockUser,
      profile: null
    };

    (Trip.findOne as jest.Mock).mockResolvedValue(tripWithBooking);
    (User.findOne as jest.Mock).mockResolvedValue(userWithoutProfile);

    const cancelData: CancelTripBookingInput = {
      tripId: mockTrip.id!,
      userId: mockUser.id!,
    };

    await expect(tripResolver.cancelTripBooking(cancelData)).rejects.toThrow(
      "L'utilisateur n'a pas de profil"
    );
  });

  it("devrait échouer si le trajet n'a pas de réservations", async () => {
    const tripWithoutBookings = {
      ...mockTrip,
      bookings: [],
    };

    (Trip.findOne as jest.Mock).mockResolvedValue(tripWithoutBookings);
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const cancelData: CancelTripBookingInput = {
      tripId: mockTrip.id!,
      userId: mockUser.id!,
    };

    await expect(tripResolver.cancelTripBooking(cancelData)).rejects.toThrow(
      "Ce trajet n'a pas de réservations"
    );
  });

  it("devrait échouer si l'utilisateur n'a pas réservé", async () => {
    const otherUser = { id: faker.string.uuid() };
    const otherBooking = {
      id: faker.string.uuid(),
      passenger: otherUser,
      trip: mockTrip,
      seatsCount: 1,
      bookingDate: new Date(),
    };

    const tripWithOtherBooking = {
      ...mockTrip,
      bookings: [otherBooking],
    };

    (Trip.findOne as jest.Mock).mockResolvedValue(tripWithOtherBooking);
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const cancelData: CancelTripBookingInput = {
      tripId: mockTrip.id!,
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
      bookings: [mockBooking],
      save: jest.fn().mockResolvedValue(true),
    };

    const userWithProfile = {
      ...mockUser,
      profile: {
        ...mockUser.profile,
        cancelledTrips: 0
      },
      save: jest.fn().mockResolvedValue(true),
    };

    (Trip.findOne as jest.Mock).mockResolvedValue(fullTrip);
    (User.findOne as jest.Mock).mockResolvedValue(userWithProfile);
    (Booking.remove as jest.Mock).mockResolvedValue(true);

    const cancelData: CancelTripBookingInput = {
      tripId: mockTrip.id!,
      userId: mockUser.id!,
    };

    await tripResolver.cancelTripBooking(cancelData);

    expect(fullTrip.status).toBe(TripStatus.OPEN);
    expect(fullTrip.save).toHaveBeenCalled();
  });

  it("devrait incrémenter le total d'annulations de l'user après annulation", async () => {
    if (!mockUser.profile) {
      throw new Error("L'utilisateur doit avoir un profil pour ce test");
    }

    const initialCancelledTrips = mockUser.profile.cancelledTrips || 0;

    const tripWithBooking = {
      ...mockTrip,
      bookings: [mockBooking],
      save: jest.fn().mockResolvedValue(true),
    };

    const mockUserWithCancelledTrips = {
      ...mockUser,
      profile: {
        ...mockUser.profile,
        cancelledTrips: initialCancelledTrips
      },
      save: jest.fn().mockResolvedValue(true),
    };

    (Trip.findOne as jest.Mock).mockResolvedValue(tripWithBooking);
    (User.findOne as jest.Mock).mockResolvedValue(mockUserWithCancelledTrips);
    (Booking.remove as jest.Mock).mockResolvedValue(true);

    const cancelData: CancelTripBookingInput = {
      tripId: mockTrip.id!,
      userId: mockUser.id!,
    };

    await tripResolver.cancelTripBooking(cancelData);

    expect(mockUserWithCancelledTrips.profile.cancelledTrips).toBe(initialCancelledTrips + 1);
    expect(mockUserWithCancelledTrips.save).toHaveBeenCalled();
  });

});