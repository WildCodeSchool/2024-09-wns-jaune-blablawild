import { Trip } from "../../../entities/trip";
import { User } from "../../../entities/user";
import { CreateTripInput } from "../../../type/tripType";
import { TripResolver } from "../../tripResolver";
import { createTripInputFactory } from "../../factories/tripFactory/createTripInputFactory";
import { userFactory } from "../../factories";

jest.mock("../../../entities/trip");
jest.mock("../../../entities/user");

describe("Trip Resolver", () => {
  let tripResolver: TripResolver;
  let newTrip: CreateTripInput;
  let exisitngUser: User;

  beforeEach(async () => {
    tripResolver = new TripResolver();
    exisitngUser = await userFactory.build();
    newTrip = await createTripInputFactory
      .withDriverId(exisitngUser.id)
      .build();
    jest.clearAllMocks();
  });

  it("should create a trip", async () => {
    (Trip.save as jest.Mock).mockResolvedValueOnce(newTrip);

    const result = await tripResolver.createTrip(newTrip);

    expect(result).toBe("Le trajet a bien été créé");
  });

  // rajouter tests en cas derreur
});
