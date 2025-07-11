import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, useGetReviewsByUserQuery } from "@/graphql/hooks";
import { DriverInfoProps } from "../_types/types";
import { useNavigate } from "react-router-dom";
import {
  calculateAverageRating,
} from "@/utils/AverageRating";
import { CircleUserRound } from "lucide-react";

export function DriverInfo({
  driver,
}: Readonly<{ driver: User | null | undefined }>) {
  if (!driver) return null;

  console.log(driver)

  const driverInfo: DriverInfoProps = {
    firstname: driver.firstname,
    image: driver.profile?.image || "",
  };

  const navigate = useNavigate();

  const { data: reviewsData } = useGetReviewsByUserQuery({
    variables: { userId: driver.id },
    skip: !driver.id,
  });

  const reviews = reviewsData?.getReviewsByUser || [];
  const averageRating = calculateAverageRating(reviews);

  const handleNavigateProfile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigate(`/user/${id}`);
  };

  return (
    <div
      onClick={(e) => handleNavigateProfile(e, driver.id)}
      className="flex items-center gap-3 hover:opacity-70"
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={driverInfo.image} alt={driverInfo.firstname} />
          <AvatarFallback><CircleUserRound size={30} strokeWidth={1.5} /></AvatarFallback>
        </Avatar>
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">
          {driverInfo.firstname}
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-600">
            {reviews.length > 0
              ? averageRating.toFixed(1)
              : "Pas d'avis"}
          </span>
          {reviews.length > 0 && (
            <span className="ml-1 text-yellow-400">★</span>
          )}
        </div>
      </div>
    </div>
  );
}
