export interface Review {
  notation: number;
}

export const calculateAverageRating = (reviews: Review[] | undefined | null): number => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  
  const sum = reviews.reduce((total, review) => total + review.notation, 0);
  return sum / reviews.length;
};
