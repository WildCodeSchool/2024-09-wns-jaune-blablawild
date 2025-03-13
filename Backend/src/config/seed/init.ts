import { setDataSource } from "typeorm-extension";
import { dataSource } from "../db";
import { User } from "../../entities/user";
import { faker } from "@faker-js/faker/locale/fr";
import { Trip } from "../../entities/trip";

const seedDatabase = async () => {
    await dataSource.initialize();
    console.log("Connected to database. Seeding data...");
    setDataSource(dataSource);

    try {
        // clear existing data
        await dataSource.getRepository(Trip).delete({})
        await dataSource.getRepository(User).delete({})

        // create users
        const users: User[] = [];
        for (let i = 0; i < 5; i++) {
            const user = new User();
            user.firstname = faker.person.firstName();
            user.lastname = faker.person.lastName();
            user.email = faker.internet.email();
            user.password = faker.internet.password();
            user.image = faker.image.avatar();
            user.role = "driver";
            user.pot = 0
            users.push(await dataSource.getRepository(User).save(user))
        }

        console.log("💪 Users seeded !")

        // create trips
        const trips: Trip[] = [];
        for (let i = 0; i < 20; i++) {
            const trip = new Trip();
            trip.departure_city = faker.location.city();
            trip.arrival_city = faker.location.city();
            trip.departure_time = faker.date.future();
            trip.driver = users[i % users.length];
            trip.price = Math.floor(Math.random() * 40);
            trips.push(await dataSource.getRepository(Trip).save(trip))
        }

        console.log("💪 Trips seeded !")

        console.log("🚀 Database seeding complete !")
    } catch (error) {
        console.error("💩 Error seeding database:", error);
    }
}

seedDatabase()