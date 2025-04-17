import { ReviewCard } from "@/components/ReviewCard";
import { useGetReviewsByUserQuery } from "@/graphql/hooks";

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
    <section className="flex flex-col justify-center items-center gap-4 mt-8 pb-12 w-full">
      {data?.getReviewsByUser.length === 0 ? (
        <p className="text-gray-500">Aucun commentaire pour le moment</p>
      ) : (
        data?.getReviewsByUser.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))
      )}
    </section>
  );
}