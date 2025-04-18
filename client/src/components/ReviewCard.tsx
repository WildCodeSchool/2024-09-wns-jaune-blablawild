import { useNavigate } from "react-router-dom";

type SenderProfile = {
  image?: string | null;
};

type ReviewSender = {
  firstname: string;
  id: string;
  profil?: SenderProfile;
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

  const navigate = useNavigate();
  
  const handleNavigateProfile = (id: string) => {
    navigate(`/user/${id}`)
  }  
  return (
    <section className="bg-gray-50 p-4 rounded-lg w-[80vw] md:w-full">
      <div className="flex items-start mb-4">
        <div onClick={()=> handleNavigateProfile(review.sender.id)}
        className="flex items-center">
          <div className="relative w-5 h-5 md:w-8 md:h-8 rounded-full overflow-hidden mr-3">
            {
              <img
              src={review.sender?.profil?.image || "/placeholder-portrait.png"}
              alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            }
            
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
