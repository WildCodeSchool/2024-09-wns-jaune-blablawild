import { formatDate } from "@/utils/FormatDate";

type SenderProfile = {
  image?: string | null;
}; 

type ReviewSender = {
  firstname: string;
  profile: SenderProfile;
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
};

type ReviewCardProps = {
  review: ReviewType;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const locale = "fr";
  
  return (
    <section className="bg-gray-50 p-6 rounded-lg w-full">
      <div className="flex items-start mb-4">
        <div className="flex items-center">
          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
            {review.sender?.profile.image && 
            <img
              src={review.sender?.profile.image}
              alt="Profile"
              className="rounded-full w-12 h-12 object-cover"
            />}
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">
              {review.sender?.firstname}
            </h3>
          </div>
        </div>
        
        <div className="ml-auto text-sm text-foreground">
          Publié le {formatDate(review.date, locale)}
        </div>
      </div>
    
      <p className="text-black mb-4">
        {review.comment}
      </p>
      <div className="flex items-center">
        <span className="mr-2">Note:</span>
        <span className="">{review.notation}/5</span>
      </div>
    </section>
  );
}