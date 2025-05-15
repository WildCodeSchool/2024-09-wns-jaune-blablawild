import { faker } from "@faker-js/faker";
import { User } from "../../../entities/user";
import { UserResolver } from "../../userResolver";
import { userFactory } from "../../factories/userFactory/userFactory";

process.env.JWT_SECRET = "test_secret_key";

jest.mock("../../../entities/user");
jest.mock("../../../services/UserServices");

describe("User queries tests", () => {
  let userResolver: UserResolver;
  it("should return the correct User given a valid id", async () => {
    userResolver = new UserResolver();

    const user = await userFactory.build();

    User.findOneBy = jest.fn().mockResolvedValue(user);

    const result = await userResolver.getUserById(user.id);

    expect(User.findOneBy).toHaveBeenCalledWith({ id: user.id });
    expect(result).toEqual(user);
  })

  
});
