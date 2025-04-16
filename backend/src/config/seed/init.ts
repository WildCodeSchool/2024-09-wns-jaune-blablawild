import { setDataSource } from "typeorm-extension";
import { dataSource } from "../db";
import { User } from "../../entities/user";
import { faker } from "@faker-js/faker/locale/fr";
import { Trip } from "../../entities/trip";
import { Transaction } from "../../entities/transaction";
import { Review } from "../../entities/review";

const seedDatabase = async () => {
    await dataSource.initialize();
    console.log("Connected to database. Seeding data...");
    setDataSource(dataSource);

    try {
        // clear existing data
        await dataSource.getRepository(Review).delete({})
        await dataSource.getRepository(Transaction).delete({})
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
            // user.role = "driver"; add later when role defined
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
            trip.capacity = Math.floor(Math.random() * 4);
            trips.push(await dataSource.getRepository(Trip).save(trip))
        }

        console.log("💪 Trips seeded !")

        // create transactions
        const transactions: Transaction[] = [];
        for (let i = 0; i < 4; i++) {
            const transaction = new Transaction();
            transaction.status = "VALIDATED"
            transaction.created_at = faker.date.future();
            transaction.price = Math.floor(Math.random() * 40);
            transaction.method = "credit card";
            transaction.trip = trips[i % trips.length];
            transaction.receiver = users[i % users.length];
            transaction.sender = users[i % users.length + 1];
            transactions.push(await dataSource.getRepository(Transaction).save(transaction))
        }
        console.log("💪 Transactions seeded !")
        
        const reviews: Review[] = [];
        for (let i = 0; i < 3; i++) {
            const review = new Review();
            review.notation = Math.floor(Math.random() * 5);
            review.comment = faker.word.words({count: Math.random()*20});
            review.date = faker.date.past();
            review.receiver = users[i % users.length];
            review.sender = users[i % users.length + 1];
            reviews.push(await dataSource.getRepository(Review).save(review))
        }
        console.log("💪 Reviews seeded !")

        console.log("🚀 Database seeding complete !")
    } catch (error) {
        console.error("💩 Error seeding database:", error);
    }
}

seedDatabase()