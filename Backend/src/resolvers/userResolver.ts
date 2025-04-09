import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/user";
import * as argon from "argon2";

@InputType()
class NewUserInput {
  @Field()
  firstname!: string;
  @Field()
  lastname!: string;
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

    @Query(() => User)
    async getUserById(@Arg("id") id: string) {
        const user = await User.findOneBy({ id })
        if (!user) throw new Error("User not found")
        return user
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
      throw new Error();
    }
  }
}
