import { UserResolver } from "../userResolver";
import { faker } from "@faker-js/faker";
import { User } from "../../entities/user";
import { NewUserInput } from "../userResolver";
import * as argon from "argon2";

jest.mock("argon2");
jest.mock("../../entities/user");
jest.mock("../../services/UserServices")

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
    jest.clearAllMocks();
  });

  it("should create a new user", async () => {
    const id = faker.string.uuid();
    const expectedUser = {
      id: id,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email
    };
    

    (User.findOne as jest.Mock).mockResolvedValueOnce(null);
    (argon.hash as jest.Mock).mockResolvedValueOnce("hashed_password");

    const userInstance = {
      id,
      ...newUser,
      password: "hashed_password",
      save: jest.fn().mockResolvedValueOnce(undefined)
    };

    (User as unknown as jest.Mock).mockImplementationOnce(() => userInstance);

    const result = await userResolver.signup(newUser, {res: mockResponse});

    expect(result).toBe(JSON.stringify(expectedUser));

    expect(argon.hash).toHaveBeenCalledWith(newUser.password);
    expect(userInstance.save).toHaveBeenCalled();
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

    await expect(userResolver.signup(newUserWithExistingEmail, {res: mockResponse})).rejects.toThrow(
      "L'utilisateur existe deja"
    );

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: existingEmail },
    });

    expect(argon.hash).not.toHaveBeenCalled();
    expect(User.save).not.toHaveBeenCalled();
  });
});

describe("User queries tests", () => {
  let userResolver: UserResolver;
  it('should return the correct User given a valid id', async () => {

    userResolver = new UserResolver()

    const id = faker.string.uuid()
    const user = {
      id: id,
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
    
    User.findOneBy = jest.fn().mockResolvedValue(user)

    const result = await userResolver.getUserById(id)

    expect(User.findOneBy).toHaveBeenCalledWith({id: id});
    expect(result).toEqual(user);
  })
});
