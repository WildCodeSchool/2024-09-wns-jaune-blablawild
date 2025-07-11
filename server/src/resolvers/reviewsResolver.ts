import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Review } from "../entities/review";
import { ReviewInput } from "../type/reviewType";
import { Trip } from "../entities/trip";
import { User } from "../entities/user";
import { isDriver, isPassenger } from "../services/ReviewServices";

@Resolver(Review)
export class ReviewResolver {
  @Query(() => [Review])
  async getReviewsByUser(@Arg("userId") userId: string) {
    const reviews = await Review.find({
      where: { 
        receiver: { id: userId } 
      },
      relations: ["sender", "receiver", "trip"]
    });
    
    return reviews;
  }

  @Mutation(() => String)
  async leaveReview(
    @Arg('data') data: ReviewInput
  ) {
    const today = new Date();
    const trip = await Trip.findOne({
      where: { id: data.trip }, 
      relations: { 
        bookings: { 
          passenger: true 
        }, 
        driver: true 
      }
    });
    const tripDate = new Date(data.date);
    const sender = await User.findOne({ where: { id: data.sender } });
    const receiver = await User.findOne({ where: { id: data.receiver } });

    if (!trip) throw new Error("Le trajet n'existe pas");
    if (!sender) throw new Error("L'utilisateur n'existe pas");
    if (!receiver) throw new Error("L'utilisateur n'existe pas");

    if (tripDate >= today) 
      throw new Error("Le trajet n'a pas encore eu lieu");

    if (!isDriver(sender, trip) && !isPassenger(sender, trip)) 
      throw new Error("Vous ne pouvez pas laisser d'évaluation à un trajet auquel vous n'avez pas participé");

    const existingReview = await Review.findOne({
      where: {
        sender: { id: data.sender },
        receiver: { id: data.receiver },
        trip: { id: data.trip }
      }
    });
    if (existingReview) throw new Error("Vous avez déjà laissé une évaluation à cet utilisateur pour ce trajet");

    if (!isDriver(receiver, trip) && isPassenger(sender, trip))
      throw new Error("Vous ne pouvez laisser d'évaluation qu'au conducteur du trajet");
    
    if (sender === receiver) 
      throw new Error("Vous ne pouvez pas vous laisser d'évaluation, petit malin.");

    const review = new Review();
    Object.assign(review, data);
    review.reviewRequested = false;
    await review.save();
    return ("Votre retour d'expérience a bien été créé");
  }
}