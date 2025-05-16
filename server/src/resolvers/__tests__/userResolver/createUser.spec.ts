import { faker } from "@faker-js/faker";
import * as argon from "argon2";
import * as jwt from "jsonwebtoken";
import { User } from "../../../entities/user";
import { LoginInput, NewUserInput, UserResolver } from "../../userResolver";
import { userFactory } from "../../factories/userFactory/userFactory";
import { userInputFactory } from "../../factories/userFactory/userInputFactory";
import { Profile } from "../../../entities/profile";

process.env.JWT_SECRET = "test_secret_key";

jest.mock("argon2");
jest.mock("../../../entities/user");
jest.mock("../../../services/UserServices");
jest.mock("jsonwebtoken");
jest.mock("../../../entities/profile");

describe("User resolver tests", () => {
  let userResolver: UserResolver;
  let newUser: NewUserInput;
  let existingUser: User;
  const mockResponse = { cookie: jest.fn() } as any;

  beforeEach(async () => {
    userResolver = new UserResolver();
    existingUser = await userFactory.build();
    newUser = await userInputFactory.build(),
      (jwt.sign as jest.Mock).mockImplementation((payload, secret, options) => {
        return "fake_token_for_testing";
      });
    jest.clearAllMocks();
  });

  it("should create a new user", async () => {
    const id = faker.string.uuid();
    const expectedResponse = {
      user: {
        id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
      },
      token: "fake_token_for_testing",
    };

    (User.findOne as jest.Mock).mockResolvedValueOnce(null);
    (argon.hash as jest.Mock).mockResolvedValueOnce("hashed_password");

    const userInstance = {
      id,
      ...newUser,
      password: "hashed_password",
      save: jest.fn().mockResolvedValueOnce(undefined),
    };

    (User as unknown as jest.Mock).mockImplementationOnce(() => userInstance);

    const profileInstance = {
      id: faker.string.uuid(),
      user: userInstance,
      save: jest.fn().mockResolvedValueOnce(undefined),
    };

    (Profile as unknown as jest.Mock).mockImplementationOnce(
      () => profileInstance
    );

    const result = await userResolver.signup(newUser, { res: mockResponse });

    expect(JSON.parse(result)).toEqual(expectedResponse);

    expect(argon.hash).toHaveBeenCalledWith(newUser.password);
    expect(userInstance.save).toHaveBeenCalled();
    expect(profileInstance.save).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledWith({ id }, "test_secret_key", {
      expiresIn: "1h",
    });
  });

  it("should not create user if email already exists", async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(existingUser);

    const newUserWithExistingEmail = {
      ...newUser,
      email: existingUser.email,
    };

    await expect(
      userResolver.signup(newUserWithExistingEmail, { res: mockResponse })
    ).rejects.toThrow("L'utilisateur existe deja");

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: existingUser.email },
    });

    expect(argon.hash).not.toHaveBeenCalled();
    expect(User.save).not.toHaveBeenCalled();
  });

  it("should successfully login a user", async () => {
    const clearPassword = "password123";

    const userLoginInput: LoginInput = {
      email: existingUser.email,
      password: clearPassword,
    };

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);

    (argon.verify as jest.Mock).mockResolvedValueOnce(true);

    const { generateToken } = require("../../../services/UserServices");

    const expectedResponse = {
      user: {
        id: existingUser.id,
        firstname: existingUser.firstname,
        lastname: existingUser.lastname,
        email: existingUser.email,
      },
      token: "fake_token_for_testing",
    };

    const result = await userResolver.login(userLoginInput, {
      res: mockResponse,
    });

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: userLoginInput.email },
    });
    expect(argon.verify).toHaveBeenCalledWith(
      existingUser.password,
      userLoginInput.password
    );
    expect(generateToken).toHaveBeenCalledWith(existingUser.id, mockResponse);

    expect(JSON.parse(result)).toEqual(expectedResponse);
    expect(jwt.sign).toHaveBeenCalled();
  }); 
});
