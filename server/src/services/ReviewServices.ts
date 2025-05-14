import { Trip } from "../entities/trip";
import { User } from "../entities/user";

export function isDriver(user: User, trip: Trip): boolean {
    return user.id === trip.driver?.id
}

export function isPassenger(user: User, trip: Trip): boolean {
    if (!trip.passengers) return false
    return trip.passengers?.some(passenger => passenger.id.toString() === user.id)
}