import TripCard from "@/components/TripCard/TripCard";
import { Trip, useGetTripByUserQuery } from "@/graphql/hooks";
import { useEffect, useRef, useState } from "react";
import van_image from "../assets/van-image-trip-form.png";
import { ReviewDialog } from "@/components/ReviewDialog";
import { useUserStore } from "@/store/useUserStore";

export default function UserJourneys() {
  const [activeTab, setActiveTab] = useState("À VENIR");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [tripsToReview, setTripsToReview] = useState<Trip[] | null>(null);
  const previousTripsRef = useRef<Trip[] | null>(null);
  const { user } = useUserStore();

  const stringifyId = String(user?.id);

  const filter =
    activeTab === "À VENIR"
      ? "upcoming"
      : activeTab === "PASSÉS"
      ? "past"
      : "published";

  const { loading, error, data } = useGetTripByUserQuery({
    variables: {
      userId: stringifyId,
      filter,
      asPassenger: activeTab !== "PUBLIÉS",
    },
  });

  const tabs = ["À VENIR", "PASSÉS", "PUBLIÉS"];

  useEffect(() => {
    if (!data?.getTripByUser) return;
    const trips = data.getTripByUser;
    const now = new Date();
    const pastTrips = trips.filter(
      (trip) => new Date(trip.departure_time) < now
    );
    if (!pastTrips) return;
    previousTripsRef.current = pastTrips as Trip[];

    const tripsWithoutReviews = pastTrips.filter((trip) => {
      const userReview = trip?.reviews?.find(
        (review) =>
          review.sender?.id === stringifyId &&
          review.receiver?.id === trip.driver?.id
      );

      if (!userReview) return true;

      const isReviewComplete =
        userReview.reviewRequested === false || userReview.notation > 0;

      return !isReviewComplete;
    }) as Trip[];

    if (tripsWithoutReviews.length > 0) {
      setTripsToReview(tripsWithoutReviews);
      setShowReviewModal(true);
    } else {
      setShowReviewModal(false);
    }
  }, [data, stringifyId]);

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setTripsToReview([]);
  };

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const trips = data?.getTripByUser ?? [];
  const now = new Date();

  let sortedTrips = [...trips];

  if (activeTab === "À VENIR") {
    sortedTrips = trips.filter((trip) => new Date(trip.departure_time) > now);
  } else if (activeTab === "PASSÉS") {
    sortedTrips = trips.filter((trip) => new Date(trip.departure_time) <= now);
  }

  const currentTripToReview =
    tripsToReview && tripsToReview.length > 0 ? tripsToReview[0] : null;

  return (
    <section className="flex min-h-screen">
      <div className="w-[15%] hidden lg:block">
        <img src={van_image} alt="van" className="h-full w-full object-cover" />
      </div>

      <div className="w-full lg:w-[70%] bg-white md:p-8 overflow-y-auto">
        <ReviewDialog
          isOpen={showReviewModal}
          onClose={handleCloseReviewModal}
          trip={currentTripToReview}
        />
        <h1 className="text-2xl my-4 px-6 md:px-0 md:text-3xl md:mb-8">
          Mes trajets
        </h1>
        <ul className="flex justify-between border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-center pb-3 cursor-pointer text-sm md:text-base font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-secondary text-secondary"
                  : "border-b-2 border-transparent text-foreground hover:text-gray-800"
              }`}
            >
              {tab}
            </li>
          ))}
        </ul>
        {sortedTrips.length > 0 ? (
          <TripCard
            trips={sortedTrips as Trip[]}
            mode={activeTab === "PUBLIÉS" ? "published" : "search"}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            Aucun trajet {activeTab.toLowerCase()} trouvé
          </div>
        )}
      </div>
      <div className="w-[15%] hidden lg:block">
        <img
          src={van_image}
          alt="van"
          className="h-full w-full object-cover object-[75%_center]"
        />
      </div>
    </section>
  );
}
