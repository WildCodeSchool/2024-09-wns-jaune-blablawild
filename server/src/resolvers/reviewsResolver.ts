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
    const trip = await Trip.findOne( {where: { id: data.trip}, relations: { passengers: true, driver: true }})
    const tripDate = new Date(data.date)
    const sender = await User.findOne( {where: {id: data.sender}})
    const receiver = await User.findOne( {where: {id: data.receiver}})

    // condition 1 : le trajet doit exister
    if (!trip) throw new Error("Le trajet n'existe pas")
    if (!sender) throw new Error("L'utilisateur n'existe pas")
    if (!receiver) throw new Error("L'utilisateur n'existe pas")

    // condition 2 : le trajet doit être passé
    if (tripDate >= today) 
      throw new Error("Le trajet n'a pas encore eu lieu")

    // condition 3 : l'utilisateur doit avoir participé au trajet
    if (!isDriver(sender, trip) && !isPassenger(sender, trip)) 
      throw new Error("Vous ne pouvez pas laisser d'évaluation à un trajet auquel vous n'avez pas participé")

    // condition 4 : l'utilisateur ne doit pas déjà avoir laissé une review à ce passager sur le trajet
    const existingReview = await Review.findOne({
      where: {
        sender: { id: data.sender },
        receiver: { id: data.receiver },
        trip: { id: data.trip }
      }
    })
    if (existingReview) throw new Error("Vous avez déjà laissé une évaluation à cet utilisateur pour ce trajet")

    // condition 5 : un passager ne peut laisser une review qu'au conducteur du trajet > s'il est sur le trajet, mais que ce n'est pas le sien, il ne peut pas laisser de review à un autre passager que le driver
    if (!isDriver(receiver, trip) && isPassenger(sender, trip))
      throw new Error("Vous ne pouvez laisser d'évaluation qu'au conducteur du trajet")
    
    // condition 6 : l'utilisateur ne peut pas se laisser une review à lui-même
    if (sender === receiver) 
      throw new Error("Vous ne pouvez pas vous laisser d'évaluation, petit malin.")

    // Laisser la review
    const review = new Review()
    Object.assign(review, data)
    review.reviewRequested = false;
    await review.save()
    return ("Votre retour d'expérience a bien été créé")
  }


}