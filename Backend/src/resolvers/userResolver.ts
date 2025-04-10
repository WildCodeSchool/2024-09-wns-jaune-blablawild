import { Arg, Field, InputType, Mutation, Resolver, Query } from "type-graphql";
import { User } from "../entities/user";
import * as argon from "argon2";

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

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async getUsers() {
    const users = await User.find();
    return users;
  }

  @Mutation(() => String)
  async signup(@Arg("data") userData: NewUserInput) {
    try {
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        throw new Error("L'utilisateur existe deja");
      }
      const hashedPassword = await argon.hash(userData.password);
      await User.save({
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: hashedPassword,
      });

      return JSON.stringify("Utilisateur créé avec success");
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  @Mutation(() => String)
  async login(@Arg("data") loginData: LoginInput) {
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
}
