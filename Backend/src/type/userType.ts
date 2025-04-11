import { User } from "../entities/user";

export type UserWithoutPassword = Omit<User, "password">

export type CreateUserExpectedOutput = {
    id: string,
    firstname: string,
    lastname: string,
    email: string
}