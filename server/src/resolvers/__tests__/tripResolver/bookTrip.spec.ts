import { faker } from "@faker-js/faker/locale/fr";
import { Trip } from "../../../entities/trip";
import { User } from "../../../entities/user";
import {
  BookTripInput,
  TripStatus,
} from "../../../type/tripType";
import { TripResolver } from "../../tripResolver";
import { tripFactory, userFactory } from "../../factories";

jest.mock("../../../entities/trip");
jest.mock("../../../entities/user");

describe("bookTrip", () => {
  let tripResolver: TripResolver;
  let mockTrip : Trip
  let mockUser: User

  beforeEach(async () => {
    tripResolver = new TripResolver();
    mockTrip = await tripFactory.build()
    mockUser = await userFactory.build()
    jest.clearAllMocks();
  });

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
