import * as argon from "argon2";
import { setDataSource } from "typeorm-extension";
import { dataSource } from "../db";
import { User } from "../../entities/user";

const seedDatabase = async () => {
  await dataSource.initialize();
  console.log("Connected to database. Seeding data...");
  setDataSource(dataSource);

  try {
    // clear existing data
    await dataSource.getRepository(User).delete({});

    // create users
    const user = new User();
    const hashedPassword = await argon.hash("UserTest2025!");
    user.password = hashedPassword;
    user.firstname = "User";
    user.lastname = "Test";
    user.email = "user.test@gmail.com";
    user.password = hashedPassword;
    user.pot = 0;
    await user.save();
    console.log("💪 Users seeded !");
  } catch (error) {
    console.error("💩 Error seeding database:", error);
  }
};

seedDatabase();
