import { faker } from "@faker-js/faker/locale/fr";
import { setDataSource } from "typeorm-extension";
import { Profile } from "../../entities/profile";
import { Review } from "../../entities/review";
import { Transaction } from "../../entities/transaction";
import { Trip } from "../../entities/trip";
import { User } from "../../entities/user";
import { dataSource } from "../db";
import { Booking } from "../../entities/booking";
import { getRandomReview, getRandomRoute } from "./seedData";

const seedDatabase = async () => {
  await dataSource.initialize();
  console.info("Connected to database. Seeding data...");
  setDataSource(dataSource);

  try {
    // clear existing data
    await dataSource.query('TRUNCATE TABLE "review", "transaction", "booking", "trip", "profile", "user" CASCADE;')
    
    // create users
    const users: User[] = [];
    for (let i = 0; i < 30; i++) {
      const user = new User();
      user.firstname = faker.person.firstName();
      user.lastname = faker.person.lastName();
      user.email = faker.internet.email({firstName: user.firstname, lastName: user.lastname});
      user.password = faker.internet.password();
      user.pot = 0;

      const profile = new Profile();
      profile.image = faker.image.avatar();
      profile.description = faker.lorem.sentence();
      profile.phoneNumber = faker.phone.number();
      profile.cancelledTrips = faker.number.int({max: 10})

      user.profile = profile;

      users.push(await dataSource.getRepository(User).save(user));
    }

    console.info("💪 Users seeded !");

    // create trips
    const trips: Trip[] = [];
    for (let currentUser of users) {
      for (let i = 0; i < 10; i++ ) {
        const trip = new Trip();
        const route = getRandomRoute()
        trip.departure_city = route.departure;
        trip.arrival_city = route.arrival;
        if (i < 2) {
          trip.departure_time = new Date()
        } else if (i < 6) {
          trip.departure_time = faker.date.between({from: '2025-01-01', to: Date.now()});
        } else {
          trip.departure_time = faker.date.soon()
        }
        trip.driver = currentUser;
        trip.price = faker.number.int({max: 40});
        trip.capacity = faker.number.int({max: 4});
        trips.push(await dataSource.getRepository(Trip).save(trip));
      }
    }
    console.info("💪 Trips seeded !");
    
    const futureTrips = trips.filter(trip => new Date(trip.departure_time) > new Date())
    const pastTrips = trips.filter(trip => !(futureTrips.includes(trip)))

    // create bookings
    const pastBookings: Booking[] = [];
    for (let currentTrip of pastTrips) {
      const bookedUsers = new Set();

      for (let i = 0; i < currentTrip.capacity; i++) {
      const booking = new Booking();
        let usersWithoutDriver = users.filter(user => user !== currentTrip.driver && !bookedUsers.has(user.id))
        if (usersWithoutDriver.length === 0) {
          break; // No more available users for this trip
        }
        let x = Math.floor(Math.random() * usersWithoutDriver.length);
        let randomUser = usersWithoutDriver[x]

        bookedUsers.add(randomUser.id)

        booking.passenger = randomUser
        booking.seatsCount = 1
        booking.trip = currentTrip
        booking.bookingDate = faker.date.between({from: currentTrip.departure_time, to: Date.now()})
        pastBookings.push(await dataSource.getRepository(Booking).save(booking));
      }
    }
    console.info("💪 Past bookings seeded !");

    const futureBookings: Booking[] = [];
    for (let currentTrip of futureTrips) {
      let takenSeats = Math.floor(Math.random() * currentTrip.capacity)
      for (let i = 0; i < takenSeats; i++) {
      const booking = new Booking();
        let usersWithoutDriver = users.filter(user => (user !== currentTrip.driver))
        let x = Math.floor(Math.random() * users.length);
        let randomUser = usersWithoutDriver[x]
        booking.passenger = randomUser
        booking.seatsCount = 1
        booking.trip = currentTrip
        booking.bookingDate = new Date()
        futureBookings.push(await dataSource.getRepository(Booking).save(booking));
      }
    }
    console.info("💪 Future bookings seeded !");

    // create transactions
    const transactions: Transaction[] = [];
    for (let currentBooking of pastBookings) {
      const transaction = new Transaction();
      transaction.status = "VALIDATED";
      transaction.trip = currentBooking.trip;
      transaction.receiver = currentBooking.trip.driver;
      transaction.sender = currentBooking.passenger;
      transaction.createdAt = faker.date.between({from: transaction.trip.departure_time, to: Date.now() });
      transaction.price = currentBooking.trip.price;
      transaction.method = "credit card";
      transactions.push(
        await dataSource.getRepository(Transaction).save(transaction)
      );
      let driver = await dataSource.getRepository(User).findOneBy({id: currentBooking.trip.driver.id})
      if (driver) {
        driver.pot += transaction.price
        await dataSource.getRepository(User).save(driver)
      }
    }
    console.info("💪 Transactions seeded !");

    // create reviews
    const reviews: Review[] = [];
    for (let booking of pastBookings) {
      const review = new Review();
      const seed = getRandomReview()
      review.notation = seed.rating;
      review.comment = seed.comment;
      review.date = faker.date.past();
      review.receiver = booking.trip.driver;
      review.sender = booking.passenger;
      reviews.push(await dataSource.getRepository(Review).save(review));
    }
    console.info("💪 Reviews seeded !");

    console.info("🚀 Database seeding complete !");
  } catch (error: any) {
    console.error("💩 Error seeding database:", error);
  } finally {
    // Ensure connection is closed
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

  }
};

seedDatabase();
