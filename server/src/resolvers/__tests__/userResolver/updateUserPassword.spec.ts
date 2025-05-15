import { User } from "../../../entities/user";
import { UserResolver } from "../../userResolver";
import * as argon from "argon2";

jest.mock("argon2");
jest.mock("../../../entities/user");

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