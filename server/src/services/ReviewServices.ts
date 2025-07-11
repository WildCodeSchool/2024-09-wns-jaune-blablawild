import { Trip } from "../entities/trip";
import { User } from "../entities/user";

export function isDriver(user: User, trip: Trip): boolean {
    return user.id.toString() === trip.driver?.id.toString();
}

export function isPassenger(user: User, trip: Trip): boolean {
    if (!trip.bookings) return false;
    return trip.bookings?.some(booking => booking.passenger.id.toString() === user.id.toString());
}