import { faker } from "@faker-js/faker/locale/fr";
import { CreateTripInput } from "../../type/tripType";
import { TripResolver } from "../tripResolver";
import { Trip } from "../../entities/trip";
import { User } from "../../entities/user";

jest.mock('../../entities/trip')
jest.mock('../../entities/user')

describe('Trip Resolver', () => {
    let tripResolver: TripResolver
    let newTrip: CreateTripInput

    beforeEach(() => {
        tripResolver = new TripResolver ()

        newTrip = {
            departure_city: faker.location.city(), 
            arrival_city: faker.location.city(), 
            departure_time: faker.date.future(), 
            price: faker.number.int(), 
            capacity: faker.number.int({min: 1, max: 10}),
            driverId: faker.string.uuid(),
        }
    })

    it('should create a trip', async () => {
        const user = {
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        (User.findOneBy as jest.Mock).mockResolvedValueOnce({ id : newTrip.driverId, ...user });
        (Trip.save as jest.Mock).mockResolvedValueOnce(newTrip);

        const result = await tripResolver.createTrip(newTrip)

        expect(result).toBe("Le trajet a bien été créé")
    })
})