import { Arg, Query, Resolver } from "type-graphql";
import { Review } from "../entities/review";

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
}