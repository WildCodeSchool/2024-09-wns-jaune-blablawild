

import { faker } from '@faker-js/faker/locale/fr';
import { Review } from '../../entities/review';
import { Trip } from '../../entities/trip';
import { User } from '../../entities/user';
import { isDriver, isPassenger } from '../../services/ReviewServices'
import { ReviewInput } from '../../type/reviewType';
import { TripStatus } from '../../type/tripType';
import { ReviewResolver } from '../reviewsResolver';

jest.mock('../../services/ReviewServices', () => ({
    isDriver: jest.fn(),
    isPassenger: jest.fn()
}))

describe('leaveReview Mutation', () => {

    let reviewResolver = new ReviewResolver

    beforeEach(() => {
        jest.clearAllMocks();

        Trip.findOne = jest.fn();
        User.findOne = jest.fn();
        Review.findOne = jest.fn();
        Review.prototype.save = jest.fn();
    })
    
    afterEach(() => {
        jest.restoreAllMocks();
    });

    const mockReviewInput: ReviewInput = {
        comment: "Voyage très agréable",
        notation: 4,
        sender: "1",
        receiver: "2",
        trip: "1", 
        date: new Date("2025-05-01T13:52:05.230Z")
    };

    const mockTrip = {
        id: "1",
        departure_city: "Paris",
        arrival_city: "Lyon",
        departure_time: new Date("2025-05-01"),
        price: 30,
        capacity: 4,
        status: TripStatus.CLOSE,
        passengers: [
            {
                id: "1",
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            }
        ],
        driver: {
                id: "2",
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            }
    };

    const mockSender = {
      id: "1",  
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const mockReceiver = {
      id: "2",  
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    test('should successfully create a review', async () => {
        // Configuration des mocks
        (Trip.findOne as jest.Mock).mockResolvedValue(mockTrip);
        (User.findOne as jest.Mock).mockImplementation((options) => {
        if (options.where.id === "1") return Promise.resolve(mockSender);
        if (options.where.id === "2") return Promise.resolve(mockReceiver);
        return Promise.resolve(null);
        });
    (Review.findOne as jest.Mock).mockResolvedValue(null); // Pas de review existante
    (Review.prototype.save as jest.Mock).mockResolvedValue(true);
    
    // Configurer les fonctions de vérification
    (isDriver as jest.Mock).mockImplementation((user, trip) => user.id === trip.driver.id);
    (isPassenger as jest.Mock).mockImplementation((user, trip) => 
      trip.passengers.some((p: any) => p.id === user.id)
    );

    // Appel de la mutation
    const result = await reviewResolver.leaveReview(mockReviewInput);
    
    // Vérifications
    expect(Trip.findOne).toHaveBeenCalledWith({
      where: { id: "1" },
      relations: { passengers: true, driver: true }
    });
    expect(User.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
    expect(User.findOne).toHaveBeenCalledWith({ where: { id: "2" } });
    expect(Review.findOne).toHaveBeenCalledWith({
      where: {
        sender: { id: "1" },
        receiver: { id: "2" },
        trip: { id: "1" }
      }
    });
    expect(Review.prototype.save).toHaveBeenCalled();
    expect(result).toBe("Votre retour d'expérience a bien été créé");
  });
})


