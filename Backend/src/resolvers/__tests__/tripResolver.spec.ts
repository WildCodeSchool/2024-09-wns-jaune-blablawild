import { faker } from "@faker-js/faker/locale/fr";
import { CreateTripInput, TripStatus, TripStatusFilter } from "../../type/tripType";
import { TripResolver } from "../tripResolver";
import { Trip } from "../../entities/trip";
import { User } from "../../entities/user";
import { LessThan, MoreThan } from "typeorm";

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
    status: TripStatus.OPEN
  };
};

describe("Trip Resolver", () => {
  let tripResolver: TripResolver;
  let newTrip: CreateTripInput;
  const today = new Date()
  const upcomingDate = today.setDate(today.getDate() + 3)
  const pastDate = today.setDate(today.getDate() - 3)

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
          driverId: 3,
        },
        {
          ...generateTrip(),
          driverId: 3,
        },
        {
          ...generateTrip(),
          driverId: 1,
        },
      ],
      expectedLength: 2,
      driverId: 3,
      filter: TripStatusFilter.PUBLISHED
    },
    {
      name: "Get trips for given filter",
      trips: [
        {
          ...generateTrip(),
          driverId: 3,
          departure_time: upcomingDate
        },
        {
          ...generateTrip(),
          driverId: 3,
          departure_time: pastDate
        },
        {
          ...generateTrip(),
          driverId: 1,
          departure_time: pastDate
        },
      ],
      expectedLength: 2,
      driverId: 3,
      filter: TripStatusFilter.UPCOMING
    },
    {
      name: "Get no trip when no driverId",
      trips: [
        {
          ...generateTrip(),
          driverId: 3,
        },
        {
          ...generateTrip(),
          driverId: 3,
        },
        {
          ...generateTrip(),
          driverId: 1,
        },
      ],
      expectedLength: 0,
      driverId: null,
      filter: TripStatusFilter.PUBLISHED
    },
  ])("$name", async ({ name, trips, expectedLength, driverId, filter }) => {
    (Trip.find as jest.Mock).mockResolvedValueOnce(null);

    const result = await tripResolver.getTripByUser(
      newTrip.driverId as string,
      filter
    );

    expect(Trip.find).toHaveBeenCalledWith({
      where: {
        driver: { id: newTrip.driverId },
        departure_time: expect.objectContaining({
          _type: "moreThan",
        }),
      },
      relations: {
        passengers: true,
        driver: true,
      },
    });
    expect(result).toBeInstanceOf(Array);
    expect(result).toHaveLength(expectedLength);
  });
});
