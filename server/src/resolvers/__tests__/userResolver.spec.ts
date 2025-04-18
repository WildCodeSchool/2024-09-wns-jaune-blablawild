import { faker } from "@faker-js/faker";
import * as argon from "argon2";
import * as jwt from "jsonwebtoken";
import { User } from "../../entities/user";
import { LoginInput, NewUserInput, UserResolver } from "../userResolver";

process.env.JWT_SECRET = "test_secret_key";

jest.mock("argon2");
jest.mock("../../entities/user");
jest.mock("../../services/UserServices");
jest.mock("jsonwebtoken");

describe("User resolver tests", () => {
  let userResolver: UserResolver;
  let newUser: NewUserInput;
  const mockResponse = { cookie: jest.fn() } as any;

  beforeEach(() => {
    userResolver = new UserResolver();
    newUser = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    (jwt.sign as jest.Mock).mockImplementation((payload, secret, options) => {
      return "fake_token_for_testing";
    });
    jest.clearAllMocks();
  });

  it("should create a new user", async () => {
    const id = faker.string.uuid();
    const expectedResponse = {
      user: {
        id: id,
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

    const result = await userResolver.signup(newUser, { res: mockResponse });

    expect(JSON.parse(result)).toEqual(expectedResponse);

    expect(argon.hash).toHaveBeenCalledWith(newUser.password);
    expect(userInstance.save).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledWith({ id }, "test_secret_key", {
      expiresIn: "1h",
    });
  });

  it("should not create user if email already exists", async () => {
    const existingEmail = faker.internet.email();

    const existingUser = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: existingEmail,
      password: faker.internet.password(),
    };

    (User.findOne as jest.Mock).mockResolvedValueOnce({
      id: faker.string.uuid(),
      ...existingUser,
    });

    const newUserWithExistingEmail = {
      ...newUser,
      email: existingEmail,
    };

    await expect(
      userResolver.signup(newUserWithExistingEmail, { res: mockResponse })
    ).rejects.toThrow("L'utilisateur existe deja");

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: existingEmail },
    });

    expect(argon.hash).not.toHaveBeenCalled();
    expect(User.save).not.toHaveBeenCalled();
  });

  it("should successfully login a user", async () => {
    const existingUser = {
      ...newUser,
      id: faker.string.uuid(),
      password: "hashed_password",
    };

    const userLoginInput: LoginInput = {
      email: existingUser.email,
      password: "clear_password",
    };

    User.findOne = jest.fn().mockResolvedValueOnce(existingUser);
    (argon.verify as jest.Mock).mockResolvedValueOnce(true);
    const { generateToken } = require("../../services/UserServices");

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

describe("User queries tests", () => {
  let userResolver: UserResolver;
  it("should return the correct User given a valid id", async () => {
    userResolver = new UserResolver();

    const id = faker.string.uuid();
    const user = {
      id: id,
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    User.findOneBy = jest.fn().mockResolvedValue(user);

    const result = await userResolver.getUserById(id);

    expect(User.findOneBy).toHaveBeenCalledWith({ id: id });
    expect(result).toEqual(user);
  })

  
});

describe("updatePassword resolver", () => {
  let userResolver: UserResolver;
  const mockUser = {
    id: 1,
    password: "hashedOldPassword",
    save: jest.fn(),
  } as unknown as User;

  const context = {
    user: { id: "1", password: "hashedOldPassword" } as User,
  };

  const data = {
    oldPassword: "oldPassword",
    newPassword: "newSecurePassword123",
    confirmPassword: "newSecurePassword123",
  };

  beforeEach(() => {
    userResolver = new UserResolver();
    jest.clearAllMocks();
  });

  it("should update the password if old password is correct", async () => {
    jest.spyOn(User, "findOneBy").mockResolvedValue(mockUser);
    (argon.verify as jest.Mock).mockResolvedValue(true);
    (argon.hash as jest.Mock).mockResolvedValue("newHashedPassword");

    const result = await userResolver.updatePassword(data, context);

    expect(User.findOneBy).toHaveBeenCalledWith({ id: "1" });
    expect(argon.verify).toHaveBeenCalledWith("hashedOldPassword", "oldPassword");
    expect(argon.hash).toHaveBeenCalledWith("newSecurePassword123");
    expect(mockUser.password).toBe("newHashedPassword");
    expect(mockUser.save).toHaveBeenCalled();
    expect(result).toBe(JSON.stringify("Le mot de passe a bien été modifié"));
  });

  it("should throw error if user is not found", async () => {
    jest.spyOn(User, "findOneBy").mockResolvedValue(null);

    await expect(userResolver.updatePassword(data, context)).rejects.toThrow("Utilisateur non trouvé");
  });

  it("should throw error if old password is incorrect", async () => {
    jest.spyOn(User, "findOneBy").mockResolvedValue(mockUser);
    (argon.verify as jest.Mock).mockResolvedValue(false);

    await expect(userResolver.updatePassword(data, context)).rejects.toThrow("L'ancien mot de passe est incorrect");
  });
});
