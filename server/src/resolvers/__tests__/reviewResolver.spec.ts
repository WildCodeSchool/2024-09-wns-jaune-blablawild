import { faker } from '@faker-js/faker/locale/fr';
import { Review } from '../../entities/review';
import { Trip } from '../../entities/trip';
import { User } from '../../entities/user';
import { Booking } from '../../entities/booking';
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
        date: "2025-05-01T13:52:05.230Z"
    };

    // Mock créé pour correspondre à la structure attendue par TypeORM
    const mockTrip = {
        id: "1",
        departure_city: "Paris",
        arrival_city: "Lyon",
        departure_time: "2025-05-01T12:52:05.230Z",
        price: 30,
        capacity: 4,
        status: TripStatus.CLOSE,
        bookings: [
            {
                id: "booking1",
                seatsCount: 1,
                passenger: {
                    id: "1",
                    firstname: faker.person.firstName(),
                    lastname: faker.person.lastName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                }
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
            trip.bookings && trip.bookings.some((booking: any) => booking.passenger.id === user.id)
        );

        // Appel de la mutation
        const result = await reviewResolver.leaveReview(mockReviewInput);
        
        // Vérifications - Mise à jour pour correspondre à l'appel réel
        expect(Trip.findOne).toHaveBeenCalledWith({
            where: { id: "1" },
            relations: {
                bookings: {
                    passenger: true
                },
                driver: true
            }
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

    // Reste des tests identiques...
    test("should fail if trip doesn't exist", async () => {
        (Trip.findOne as jest.Mock).mockResolvedValue(null);

        await expect(reviewResolver.leaveReview(mockReviewInput)).rejects.toThrow("Le trajet n'existe pas");
        expect(Review.prototype.save).not.toHaveBeenCalled();
    })

    test("should fail if no sender found", async () => {
        (Trip.findOne as jest.Mock).mockResolvedValue(mockTrip);
        (User.findOne as jest.Mock).mockImplementation((options) => {
            if (options.where.id === "1") return Promise.resolve(null);
            if (options.where.id === "2") return Promise.resolve(mockReceiver);
            return Promise.resolve(null);
        });
    
        await expect(reviewResolver.leaveReview(mockReviewInput)).rejects.toThrow("L'utilisateur n'existe pas");
        expect(Review.prototype.save).not.toHaveBeenCalled();
    })

    test("should fail if no receiver found", async () => {
        (Trip.findOne as jest.Mock).mockResolvedValue(mockTrip);
        (User.findOne as jest.Mock).mockImplementation((options) => {
            if (options.where.id === "1") return Promise.resolve(mockSender);
            if (options.where.id === "2") return Promise.resolve(null);
            return Promise.resolve(null);
        });
    
        await expect(reviewResolver.leaveReview(mockReviewInput)).rejects.toThrow("L'utilisateur n'existe pas");
        expect(Review.prototype.save).not.toHaveBeenCalled();
    })

    test("should fail if trip has not happened yet", async () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 10); // Date future
        
        const futureTrip = {
            ...mockTrip,
            departure_time: futureDate
        };
    
        const futureReviewInput = {
            ...mockReviewInput,
            date: futureDate.toISOString()
        };
    
        (Trip.findOne as jest.Mock).mockResolvedValue(futureTrip);
        (User.findOne as jest.Mock).mockImplementation((options) => {
            if (options.where.id === "1") return Promise.resolve(mockSender);
            if (options.where.id === "2") return Promise.resolve(mockReceiver);
            return Promise.resolve(null);
        });
    
        await expect(reviewResolver.leaveReview(futureReviewInput)).rejects.toThrow("Le trajet n'a pas encore eu lieu");
        expect(Review.prototype.save).not.toHaveBeenCalled();
    })

    test("should fail if user was not on the trip", async () => {
        const tripWithoutUser = {
            ...mockTrip,
            bookings: [{
                id: "booking1",
                seatsCount: 1,
                passenger: {
                    id: "3",
                    firstname: faker.person.firstName(),
                    lastname: faker.person.lastName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                }
            }] // Autre passager
        };
        
        (Trip.findOne as jest.Mock).mockResolvedValue(tripWithoutUser);
        (User.findOne as jest.Mock).mockImplementation((options) => {
            if (options.where.id === "1") return Promise.resolve(mockSender);
            if (options.where.id === "2") return Promise.resolve(mockReceiver);
            return Promise.resolve(null);
        });
        
        // Mock les fonctions pour indiquer que l'utilisateur n'est ni conducteur ni passager
        (isDriver as jest.Mock).mockReturnValue(false);
        (isPassenger as jest.Mock).mockReturnValue(false);
        
        await expect(reviewResolver.leaveReview(mockReviewInput)).rejects.toThrow(
        "Vous ne pouvez pas laisser d'évaluation à un trajet auquel vous n'avez pas participé"
        );
        expect(Review.prototype.save).not.toHaveBeenCalled();  
    })

    test("should fail if user already left a review", async () => {
        (Trip.findOne as jest.Mock).mockResolvedValue(mockTrip);
        (User.findOne as jest.Mock).mockImplementation((options) => {
            if (options.where.id === "1") return Promise.resolve(mockSender);
            if (options.where.id === "2") return Promise.resolve(mockReceiver);
            return Promise.resolve(null);
        });
        (Review.findOne as jest.Mock).mockResolvedValue({ id: "existingReview" }); // Review existante
        
        // Mock les fonctions pour permettre la participation
        (isDriver as jest.Mock).mockImplementation((user, trip) => 
            user.id === trip.driver.id
        );
        (isPassenger as jest.Mock).mockImplementation((user, trip) => 
            trip.bookings && trip.bookings.some((booking: any) => booking.passenger.id === user.id)
        );
        
        await expect(reviewResolver.leaveReview(mockReviewInput)).rejects.toThrow(
            "Vous avez déjà laissé une évaluation à cet utilisateur pour ce trajet"
        );
        expect(Review.prototype.save).not.toHaveBeenCalled();
    })

    test("should fail if a passenger try to review another passenger", async () => {
        const tripWithTwoPassengers = {
            ...mockTrip,
            bookings: [
                { 
                    id: "booking1", 
                    seatsCount: 1,
                    passenger: { id: "1", username: "user1" }
                }, 
                { 
                    id: "booking2", 
                    seatsCount: 1,
                    passenger: { id: "2", username: "user2" }
                }
            ],
            driver: { id: "3", username: "user3" }  // Le conducteur est quelqu'un d'autre
        };
    
        (Trip.findOne as jest.Mock).mockResolvedValue(tripWithTwoPassengers);
        (User.findOne as jest.Mock).mockImplementation((options) => {
            if (options.where.id === "1") return Promise.resolve(mockSender);
            if (options.where.id === "2") return Promise.resolve(mockReceiver);
            return Promise.resolve(null);
        });
        (Review.findOne as jest.Mock).mockResolvedValue(null);
    
        // Mock des fonctions pour indiquer que le sender est un passager et le receiver n'est pas le conducteur
        (isDriver as jest.Mock).mockImplementation((user, trip) => 
            user.id === trip.driver.id
        );
        (isPassenger as jest.Mock).mockImplementation((user, trip) => 
            trip.bookings && trip.bookings.some((booking: any) => booking.passenger.id === user.id)
        );
        
        await expect(reviewResolver.leaveReview(mockReviewInput)).rejects.toThrow(
        "Vous ne pouvez laisser d'évaluation qu'au conducteur du trajet"
        );
        expect(Review.prototype.save).not.toHaveBeenCalled();
    })

    test("should fail if user try to review himself", async () => {
        // Modifier l'entrée pour avoir le même expéditeur et destinataire
        const selfReviewInput = {
            ...mockReviewInput,
            sender: "1",
            receiver: "1"
        };
        
        const mockSameUser = { id: "1", username: "user1" };
        
        (Trip.findOne as jest.Mock).mockResolvedValue(mockTrip);
        (User.findOne as jest.Mock).mockResolvedValue(mockSameUser);  // Même utilisateur pour les deux
        (Review.findOne as jest.Mock).mockResolvedValue(null);
        
        // Mock des fonctions pour permettre la participation
        (isDriver as jest.Mock).mockReturnValue(true);  // Pour simplifier le test
        
        await expect(reviewResolver.leaveReview(selfReviewInput)).rejects.toThrow(
            "Vous ne pouvez pas vous laisser d'évaluation, petit malin."
        );
        expect(Review.prototype.save).not.toHaveBeenCalled();
    });
})