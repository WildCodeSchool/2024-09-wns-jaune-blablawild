import { Arg, Field, InputType, Mutation, Resolver, Query, Ctx } from "type-graphql";
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
  async signup(@Arg("data") userData: NewUserInput, @Ctx() { res }: { res: Response }) {
    try {
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        throw new Error("L'utilisateur existe deja");
      }

      const user = new User()
      Object.assign(user, userData)

      const hashedPassword = await argon.hash(userData.password);
      user.password = hashedPassword

      await user.save()

      generateToken(user.id, res)

      return JSON.stringify({ 
        firstname: user.firstname, 
        id: user.id, 
        lastname: user.lastname, 
        email: user.email 
      });
      
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}
