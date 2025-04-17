import { ReviewCard } from "@/components/ReviewCard";
import { useGetReviewsByUserQuery, User } from "@/graphql/hooks";

type Props = {
  user: { id: string } 
}

export default function UserReviews({ user }: Props) {
  const { data, loading, error } = useGetReviewsByUserQuery({
    variables: { userId: user.id! },
    skip: !user.id
  });
  
  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error loading reviews: {error.message}</p>;
  

  return (
    <section className="flex flex-col justify-center items-center gap-4 mt-8">
    {data?.getReviewsByUser.map((review) => (
      <ReviewCard key={review.id} review={review} />
    ))}
  </section>
  );
}