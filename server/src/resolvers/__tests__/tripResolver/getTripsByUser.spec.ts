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

  it("DEBUG: should show actual call to Trip.find", async () => {
    const mockDriver = { id: "3", firstname: "Driver3" } as User;
    const mockTrip = tripFactory.withDriver(mockDriver).build();
    
    (Trip.find as jest.Mock).mockResolvedValueOnce([mockTrip]);

    await tripResolver.getTripByUser("3", TripStatusFilter.PUBLISHED, false);

    console.log("Actual call to Trip.find:", (Trip.find as jest.Mock).mock.calls[0]);
    
    expect(Trip.find).toHaveBeenCalledTimes(1);
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
          bookings: {
            passenger: true,
          },
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
    const mockUser = { id: "user1", firstname: "John", lastname: "Doe" } as User;
    const mockDriver1 = { id: "driver1", firstname: "Driver1" } as User;
    const mockDriver2 = { id: "driver2", firstname: "Driver2" } as User;
    
    const mockBooking1 = {
      id: "booking1",
      passenger: mockUser,
      seatsCount: 1,
      bookingDate: new Date(),
    } as Booking;
    
    const mockBooking2 = {
      id: "booking2",
      passenger: mockUser,
      seatsCount: 2,
      bookingDate: new Date(),
    } as Booking;
    
    const mockTrip1 = tripFactory
      .withId("trip1")
      .withDriver(mockDriver1)
      .withBookings([mockBooking1])
      .build();
    
    const mockTrip2 = tripFactory
      .withId("trip2")
      .withDriver(mockDriver2)
      .withBookings([mockBooking2])
      .build();

    (Trip.find as jest.Mock).mockResolvedValue([mockTrip1, mockTrip2]);

    const result = await tripResolver.getTripByUser(
      "user1",
      TripStatusFilter.PUBLISHED,
      true 
    );

    expect(Trip.find).toHaveBeenCalledWith({
      where: {
        bookings: {
          passenger: {
            id: "user1",
          },
        },
      },
      relations: {
        bookings: {
          passenger: true,
        },
        driver: true,
        reviews: {
          sender: true,
          receiver: true,
        },
      },
    });

    expect(result).toHaveLength(2);
    expect(result).toEqual([mockTrip1, mockTrip2]);
    expect(result[0].driver.id).toBe("driver1");
    expect(result[1].driver.id).toBe("driver2");
  });

  it("should handle case when user has no trips as passenger", async () => {
    (Trip.find as jest.Mock).mockResolvedValue([]);

    const result = await tripResolver.getTripByUser(
      "user-with-no-trips",
      TripStatusFilter.PUBLISHED,
      true 
    );

    expect(Trip.find).toHaveBeenCalledWith({
      where: {
        bookings: {
          passenger: {
            id: "user-with-no-trips",
          },
        },
      },
      relations: {
        bookings: {
          passenger: true,
        },
        driver: true,
        reviews: {
          sender: true,
          receiver: true,
        },
      },
    });

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it("should throw error when no trips found for driver", async () => {
    (Trip.find as jest.Mock).mockResolvedValue(null);

    await expect(
      tripResolver.getTripByUser("driver-id", TripStatusFilter.PUBLISHED, false)
    ).rejects.toThrow("No trips found for this user");
  });
});