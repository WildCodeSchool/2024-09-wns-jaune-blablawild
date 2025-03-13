import { setDataSource } from "typeorm-extension";
import { dataSource } from "../db";
import { User } from "../../entities/user";
import { faker } from "@faker-js/faker/locale/fr";

const seedDatabase = async () => {
    await dataSource.initialize();
    console.log("Connected to database. Seeding data...");
    setDataSource(dataSource);

    try {
        // clear existing data
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

        console.log("💪 Database seeding complete!")
    } catch (error) {
        console.error("💩 Error seeding database:", error);
    }
}

seedDatabase()