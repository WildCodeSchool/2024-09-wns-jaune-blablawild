import {
  Arg,
  Field,
  InputType,
  Mutation,
  Resolver,
  Query,
  Ctx,
  Authorized,
} from "type-graphql";
import { User } from "../entities/user";
import * as argon from "argon2";
import { generateToken } from "../services/UserServices";
import { Response } from "express";

@InputType()
export class NewUserInput {
  @Field()
  firstname!: string;
  @Field()
  lastname!: string;
  @Field()
  email!: string;
  @Field()
  password!: string;
}

@InputType()
export class LoginInput {
  @Field()
  email!: string;
  @Field()
  password!: string;
}

@InputType()
export class UpdatePasswordInput {
  @Field()
  oldPassword!: string;
  @Field()
  newPassword!: string;
  @Field()
  confirmPassword!: string;
}

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async getUsers() {
    const users = await User.find();
    return users;
  }

  @Query(() => User)
  async getUserById(@Arg("id") id: string) {
    const user = await User.findOneBy({ id });
    if (!user) throw new Error("User not found");
    return user;
  }

  @Mutation(() => String)
  async signup(
    @Arg("data") userData: NewUserInput,
    @Ctx() { res }: { res: Response }
  ) {
    try {
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        throw new Error("L'utilisateur existe deja");
      }

      const user = new User();
      Object.assign(user, userData);

      const hashedPassword = await argon.hash(userData.password);
      user.password = hashedPassword;

      await user.save();

      generateToken(user.id, res);

      return JSON.stringify({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  @Mutation(() => String)
  async login(
    @Arg("data") loginData: LoginInput,
    @Ctx() { res }: { res: Response }
  ) {
    try {
      const user = await User.findOne({
        where: { email: loginData.email },
      });

      if (!user) throw new Error("Utilisateur non trouvé");

      const isPasswordValid = await argon.verify(
        user.password,
        loginData.password
      );

      if (!isPasswordValid) throw new Error("Mot de passe incorrect");

      generateToken(user.id, res);

      const userData = {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      };

      return JSON.stringify(userData);
    } catch (error) {
      throw error;
    }
  }

  @Authorized()
  @Mutation(() => String)
  async updatePassword(
    @Arg("data") data: UpdatePasswordInput,
    @Ctx() context: { user: User }
  ) {
    const user = await User.findOneBy({ id: context.user.id });
    if (!user) throw new Error("Utilisateur non trouvé");
    const isPasswordValid = await argon.verify(user.password, data.oldPassword);
    if (!isPasswordValid)
      throw new Error("L'ancien mot de passe est incorrect");
    const hashedPassword = await argon.hash(data.newPassword);
    user.password = hashedPassword;
    await user.save();
    return JSON.stringify("Le mot de passe a bien été modifié");
  }
}
