import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Review } from "../entities/review";
import { ReviewInput } from "../type/reviewType";
import { Trip } from "../entities/trip";

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
    @Arg('data') data: ReviewInput,
    @Arg('reviewerId') reviewerId: string
  ) {

    const today = new Date();

    // condition 1 : le trajet doit exister
    // condition 2 : le trajet doit être passé
    // condition 3 : l'utilisateur doit avoir participé au trajet
    // condition 4 : l'utilisateur ne doit pas déjà avoir laissé une review à ce passager sur le trajet
    // condition 5 : un passager ne peut laisser une review qu'au conducteur du trajet > s'il est sur le trajet, mais que ce n'est pas le sien, il ne peut pas laisser de review à un autre passager que le driver
    // condition 6 : l'utilisateur ne peut pas se laisser une review à lui-même
    // Laisser la review
    const review = new Review()
    Object.assign(review, data)
    console.log(new Date())
    await review.save()
    return ("Votre retour d'expérience a bien été créé")
  }

}