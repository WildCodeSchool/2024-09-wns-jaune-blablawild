import { Trip } from "../../../entities/trip";
import { User } from "../../../entities/user";
import { Booking } from "../../../entities/booking";
import { TripStatusFilter } from "../../../type/tripType";
import { TripResolver } from "../../tripResolver";
import { TripFactory } from "../../factories/tripFactory/tripFactory";

jest.mock("../../../entities/trip");
jest.mock("../../../entities/user");
jest.mock("../../../entities/booking");

describe("get trips by user", () => {
  let tripResolver: TripResolver;
  let tripFactory: TripFactory;

  beforeEach(() => {
    tripResolver = new TripResolver();
    tripFactory = new TripFactory();
    jest.clearAllMocks();
  });

  it.each([
    {
      name: "Get trips for given driverId",
      setupTrips: () => {
        const mockDriver3 = { id: "3", firstname: "Driver3" } as User;
        const mockDriver1 = { id: "1", firstname: "Driver1" } as User;
        
        return [
          tripFactory.withDriver(mockDriver3).build(),
          tripFactory.withDriver(mockDriver3).build(),
          tripFactory.withDriver(mockDriver1).build(),
        ];
      },
      expectedLength: 2,
      driverId: "3",
      filter: TripStatusFilter.PUBLISHED,
    },
    {
      name: "Get no trip when no driverId",
      setupTrips: () => {
        const mockDriver3 = { id: "3", firstname: "Driver3" } as User;
        const mockDriver1 = { id: "1", firstname: "Driver1" } as User;
        
        return [
          tripFactory.withDriver(mockDriver3).build(),
          tripFactory.withDriver(mockDriver3).build(),
          tripFactory.withDriver(mockDriver1).build(),
        ];
      },
      expectedLength: 0,
      driverId: null,
      filter: TripStatusFilter.PUBLISHED,
    },
  ])(
    "$name",
    async ({ name, setupTrips, expectedLength, driverId, filter }) => {
      const trips = setupTrips();

      const filteredTrips = trips?.filter(
        (trip: Trip) => trip.driver?.id === driverId
      );
      (Trip.find as jest.Mock).mockResolvedValueOnce(filteredTrips);

      const result = await tripResolver.getTripByUser(
        driverId as string,
        filter,
        false
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
          driver: true,
          reviews: {
            receiver: true,
            sender: true,
          },
        },
      });
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(expectedLength);
    }
  );

  it("should get trips where user is passenger", async () => {
    const mockUser = { id: "user1" } as User;
    const mockTrip1 = { id: "trip1", driver: { id: "driver1" } } as Trip;
    const mockTrip2 = { id: "trip2", driver: { id: "driver2" } } as Trip;
    
    const mockBookings = [
      {
        id: "booking1",
        passenger: mockUser,
        trip: mockTrip1,
        seatsCount: 1,
      },
      {
        id: "booking2",
        passenger: mockUser,
        trip: mockTrip2,
        seatsCount: 2,
      },
    ] as Booking[];

    (Booking.find as jest.Mock).mockResolvedValue(mockBookings);

    const result = await tripResolver.getTripByUser(
      "user1",
      TripStatusFilter.PUBLISHED,
      true // asPassenger = true
    );

    expect(Booking.find).toHaveBeenCalledWith({
      where: {
        passenger: { id: "user1" },
      },
      relations: {
        trip: {
          driver: true,
          reviews: {
            sender: true,
            receiver: true,
          },
        },
      },
    });

    expect(result).toHaveLength(2);
    expect(result).toEqual([mockTrip1, mockTrip2]);
  });
});