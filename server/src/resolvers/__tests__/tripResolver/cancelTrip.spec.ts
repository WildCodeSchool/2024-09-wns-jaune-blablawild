import { faker } from "@faker-js/faker/locale/fr";
import { Trip } from "../../../entities/trip";
import { User } from "../../../entities/user";
import { CancelTripBookingInput, TripStatus } from "../../../type/tripType";
import { TripResolver } from "../../tripResolver";
import { tripFactory, userFactory } from "../../factories";

jest.mock("../../../entities/trip");
jest.mock("../../../entities/user");

describe("cancelTrip",  () => {
  let tripResolver: TripResolver;
  let mockTrip: Trip;
  let mockUser: User;

  beforeEach(async () => {
    tripResolver = new TripResolver();
    mockTrip = await tripFactory.build();
    mockUser = await userFactory.withProfile().build();
    jest.clearAllMocks();
  });

  it("devrait annuler une réservation avec succès", async () => {
    const tripWithUser = {
      ...mockTrip,
      passengers: [mockUser],
      save: jest.fn().mockResolvedValue(true),
    };

    (Trip.findOne as jest.Mock).mockResolvedValue(tripWithUser);
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const cancelData: CancelTripBookingInput = {
      tripId: tripWithUser.id!,
      userId: mockUser.id!,
    };

    const result = await tripResolver.cancelTripBooking(cancelData);

    expect(result).toBe("Votre réservation a bien été annulée");
    expect(tripWithUser.passengers).not.toContainEqual(mockUser);
    expect(tripWithUser.save).toHaveBeenCalled();
    expect(mockUser.profile!.cancelledTrips).toBe(1);
    expect(mockUser.save).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ 
      where: { id: mockUser.id },
      relations: ["profile"]
    });
    expect(Trip.findOne).toHaveBeenCalledWith({
      where: { id: tripWithUser.id },
      relations: { passengers: true }
    });
  });

  it("devrait échouer si l'utilisateur n'a pas réservé", async () => {
    const tripWithoutUser = {
      ...mockTrip,
      passengers: [{ id: faker.string.uuid() }],
    };

    (Trip.findOne as jest.Mock).mockResolvedValue(tripWithoutUser);
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

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
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const cancelData: CancelTripBookingInput = {
      tripId: fullTrip.id!,
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

    const fullTrip = {
      ...mockTrip,
      passengers: [mockUser],
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

    (Trip.findOne as jest.Mock).mockResolvedValue(fullTrip);
    (User.findOne as jest.Mock).mockResolvedValue(mockUserWithCancelledTrips);

    const cancelData: CancelTripBookingInput = {
      tripId: fullTrip.id!,
      userId: mockUser.id!,
    };

    await tripResolver.cancelTripBooking(cancelData);

    expect(mockUserWithCancelledTrips.profile.cancelledTrips).toBe(initialCancelledTrips + 1);
    expect(mockUserWithCancelledTrips.save).toHaveBeenCalled();
    expect(fullTrip.save).toHaveBeenCalled();
  });

});
