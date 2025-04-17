type ReviewSender = {
  firstname: string;
  image?: string | null;
};

type ReviewReceiver = {
  firstname: string;
};

export type ReviewType = {
  id: string;
  comment: string;
  date: any;
  notation: number;
  sender: ReviewSender;
  receiver: ReviewReceiver;
};

type ReviewCardProps = {
  review: ReviewType;
};

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const formatShortDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("fr-FR").format(new Date(date));
  };

  return (
    <section className="bg-gray-50 p-4 rounded-lg w-[80vw] md:w-[60vw]">
      <div className="flex items-start mb-4">
        <div className="flex items-center">
          <div className="relative w-5 h-5 md:w-8 md:h-8 rounded-full overflow-hidden mr-3">
            {review.sender?.image && (
              <img
                src={review.sender?.image}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </div>
          <div>
            <h3 className="text-xs font-medium text-foreground">
              {review.sender?.firstname}
            </h3>
          </div>
        </div>
        <div className="ml-auto text-xs text-foreground">
          Publié le {formatShortDate(review.date)}
        </div>
      </div>
      <p className="text-black mb-4">{review.comment}</p>
      <div className="flex items-center">
        <p className="mr-2">Note:</p>
        <p>{review.notation}/5</p>
      </div>
    </section>
  );
};
