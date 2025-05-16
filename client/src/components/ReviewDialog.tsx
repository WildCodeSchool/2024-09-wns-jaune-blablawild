import { Dialog, DialogContent } from "./ui/dialog";
import { useState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Trip, useLeaveReviewMutation } from "@/graphql/hooks";
import { formatDate } from "@/utils/FormatDate";
import { z } from "zod";
import { useUserStore } from "@/store/useUserStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/contexts/ToasterContext";

interface ReviewDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
  trip?: Trip | null;
}

const reviewSchema = z.object({
  comment: z.string().default(""),
  notation: z.number().min(1, "Veuillez attribuer une note").max(5),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export const ReviewDialog = ({
  isOpen = false,
  onClose,
  trip,
}: ReviewDialogProps) => {
  const { user } = useUserStore();
  const [open, setOpen] = useState(isOpen);

  const [leaveReview, { loading: isSubmitting }] = useLeaveReviewMutation();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      comment: "",
      notation: 0,
    },
  });

  const currentRating = watch("notation");

  useEffect(() => {
    setOpen(isOpen);
    if (isOpen) {
      reset({
        comment: "",
        notation: 0,
      });
    }
  }, [isOpen, trip, reset]);

  const handleClose = () => {
    if (currentRating === 0) {
      handleRejectReview();
    } else {
      setOpen(false);
      if (onClose) onClose();
    }
  };

  const handleRejectReview = async () => {
    try {
      await leaveReview({
        variables: {
          data: {
            comment: "",
            date: trip?.departure_time,
            notation: 0,
            receiver: trip?.driver?.id || "",
            sender: String(user?.id),
            trip: trip?.id || "",
            reviewRequested: false, 
          },
        },
      });
      
      setOpen(false);
      if (onClose) onClose();
    } catch (err) {
      console.error("Erreur lors du rejet de l'avis:", err);
      setOpen(false);
      if (onClose) onClose();
    }
  };

  const handleStarClick = (star: number, e: React.MouseEvent) => {
    e.preventDefault();
    setValue("notation", star, { shouldValidate: true });
  };

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      await leaveReview({
        variables: {
          data: {
            comment: data.comment,
            date: trip?.departure_time,
            notation: data.notation,
            receiver: trip?.driver?.id || "",
            sender: String(user?.id),
            trip: trip?.id || "",
            reviewRequested: false, 
          },
        },
      });
      
      handleClose();
      toast.success("Votre avis a été publié avec succès");
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Erreur lors de la soumission de l'avis");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="bg-white w-[496px] h-[374px] p-6 max-w-md mx-auto rounded-lg">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-medium text-black">
            Laissez un avis à {trip?.driver?.firstname} !
          </h2>
        </div>
        <p className="text-base text-black">
          Votre trajet {trip?.departure_city} - {trip?.arrival_city} du{" "}
          {formatDate(trip?.departure_time, "fr")}
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-center space-x-4 my-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={(e) => handleStarClick(star, e)}
                  type="button"
                  className="group focus:outline-none mr-1"
                  aria-label={`Noter ${star} étoile${star > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`
                      w-6 h-6
                      transition-colors
                      ${
                        currentRating >= star
                          ? "text-secondary"
                          : "text-gray-300 group-hover:text-accent"
                      }
                    `}
                    strokeWidth={1}
                    fill={currentRating >= star ? "#f97316" : "none"}
                    style={{
                      stroke: "currentColor",
                    }}
                  />
                </button>
              ))}
            </div>
         
          </div>

          {errors.notation && (
            <p className="text-red-500 text-sm text-center mb-2">
              {errors.notation.message}
            </p>
          )}

          <div className="mb-4">
            <Label htmlFor="comment" className="text-black mb-2 block">
              Votre commentaire
            </Label>

            <Textarea
              id="comment"
              className="h-[100px] bg-[#F3F3F3] text-forecast w-full"
              placeholder="Partager votre expérience..."
              {...register("comment")}
            />
          </div>

          <div className="flex justify-evenly gap-4 mt-6">
            <Button
              type="button"
              className="w-[170px] h-[49px] bg-transparent rounded-full"
              variant={"outline"}
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {"Pas maintenant"}
            </Button>

            <Button
              type="submit"
              className="w-[170px] h-[49px] rounded-full"
              variant={"default"}
              disabled={isSubmitting || currentRating === 0}
            >
              {isSubmitting ? "Envoi..." : "Publier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};