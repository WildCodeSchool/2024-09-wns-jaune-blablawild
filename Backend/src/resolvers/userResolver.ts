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

    @Mutation(() => String)
    async signup(
        @Arg("data") userData: NewUserInput,
    ) {
        // const existingUser = await User.findOne({ where: { email: userData.email } });
        // if (existingUser) {
        //     throw new Error("L'utilisateur existe deja");
        // }
       const hashedPassword = await argon.hash(userData.password)
       const user = await User.save({
           firstname: userData.firstname,
           lastname: userData.lastname,
           email: userData.email,
           password: hashedPassword
       })

     return JSON.stringify("Utilisateur créé avec success") 
    }

}