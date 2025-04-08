import { Arg, Query, Resolver } from "type-graphql";
import { User } from "../entities/user";

@Resolver(User)
export class UserResolver {
    @Query(() => User)
    async getUserById(@Arg("id") id: string) {
        const user = await User.findOneBy({ id })
        if (!user) throw new Error("User not found")
        return user
    }
}