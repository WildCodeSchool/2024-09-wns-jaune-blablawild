import { Trip } from "../../../entities/trip";
import { TripStatusFilter } from "../../../type/tripType";
import { TripResolver } from "../../tripResolver";
import { tripFactory } from "../../factories";

jest.mock("../../../entities/trip");
jest.mock("../../../entities/user");

describe("get trips by user", () => {
  let tripResolver: TripResolver;

  beforeEach(() => {
    tripResolver = new TripResolver();
    jest.clearAllMocks();
  });

  it.each([
    {
      name: "Get trips for given driverId",
      setupTrips: async () => {
        return [
          await tripFactory.withDriver("3").build(),
          await tripFactory.withDriver("3").build(),
          await tripFactory.withDriver("1").build(),
        ];
      },
      expectedLength: 2,
      driverId: "3",
      filter: TripStatusFilter.PUBLISHED,
    },
    {
      name: "Get no trip when no driverId",
      setupTrips: async () => {
        return [
          await tripFactory.withDriver("3").build(),
          await tripFactory.withDriver("3").build(),
          await tripFactory.withDriver("1").build(),
        ];
      },
      expectedLength: 0,
      driverId: null,
      filter: TripStatusFilter.PUBLISHED,
    },
  ])(
    "$name",
    async ({ name, setupTrips, expectedLength, driverId, filter }) => {
      const trips = await setupTrips();

      const filteredTrips = trips?.filter(
        (trip) => trip.driver?.id === driverId
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
          passengers: true,
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
});
