import { Arg, Ctx, Field, InputType, Mutation, Resolver, Query } from "type-graphql";
import { User } from "../entities/user";
import * as argon from "argon2";


@InputType()
class NewUserInput {
    @Field()
    firstname!: string
    @Field()
    lastname!: string
    @Field()
    email!: string
    @Field()
    password!: string
}

@Resolver(User)
export class UserResolver {
    @Query(() => [User])
    async getUsers() {
      const users = await User.find();
      return users;
    }

    @Mutation(() => User)
    async signup(
        @Arg("data") userData: NewUserInput,
    ) {
       const hashedPassword = await argon.hash(userData.password)
       const user = await User.save({
           firstname: userData.firstname,
           lastname: userData.lastname,
           email: userData.email,
           password: hashedPassword
       })

     return user
    }

}