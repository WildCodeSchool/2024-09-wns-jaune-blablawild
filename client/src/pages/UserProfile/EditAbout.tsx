import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Profile, useGetProfileQuery, useGetReviewsByUserQuery, usePatchProfileMutation } from "@/graphql/hooks";
import { calculateAverageRating } from "@/utils/AverageRating";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type ProfileFormData = {
  phoneNumber: string | null;
  image: string | null;
  description: string | null;
};

type Props = {
  user: {
    id?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    profile?: Partial<Profile> | null;
  };
  onCancel: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditAbout({ user, onCancel }: Props) {
  const { data, refetch } = useGetProfileQuery({
    skip: !user.id,
    variables: { userId: user.id || "13" }
  });

    const { data: reviewsData } = useGetReviewsByUserQuery({
      variables: { userId: user.id! },
      skip: !user.id
    });
  

  const [updateProfile] = usePatchProfileMutation();

    const reviews = reviewsData?.getReviewsByUser || [];
    const reviewsCount = reviews.length;
    const averageRating = calculateAverageRating(reviews);
  

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormData>({
  });

  useEffect(() => {
    if (data?.getProfile) {
      reset({
        phoneNumber: data.getProfile.phoneNumber || "",
        image: user.profile?.image || "",
        description: data.getProfile.description || ""
      });
    }
  }, [data, user.profile, reset]);

  const onSubmit = async (formData: ProfileFormData) => {
    try {
      await updateProfile({
        variables: {
          userId: user.id || "",
          profileInput: {
            phoneNumber: formData.phoneNumber,
            image: formData.image,
            description: formData.description
          }
        }
      });
      refetch();
      onCancel(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center gap-8 mt-6 pb-12 w-full">
      <div className="flex flex-col w-full items-center md:flex-row-reverse md:justify-between lg:w-10/12">
        <div className="flex flex-col items-center gap-2 mb-8 md:mb-0">
          <img
            src={user.profile?.image || "/placeholder-portrait.png"}
            alt={`${user.firstname} ${user.lastname}`}
            className="w-40 self-center rounded-full"
          />
          <input
            type="text"
            placeholder="URL de l'image"
            className="border rounded p-2 w-full text-sm bg-white md:bg-transparent"
            {...register("image")}
          />
        </div>

        <div className="flex flex-col items-center gap-6 md:gap-8 md:items-start text-black">
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Numéro de téléphone</label>
            <input
              type="tel"
              placeholder="Numéro de téléphone"
              className="border rounded p-2 w-full bg-white md:bg-transparent"
              {...register("phoneNumber", {
                pattern: {
                  value: /^[0-9+\s()-]+$/,
                  message: "Format de téléphone invalide"
                }
              })}
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
          </div>
          <p data-testid="user-email">{user.email}</p>
          <p>Profil verifié</p>
        </div>
      </div>

      <Separator className="bg-[#949393]" />

    <div className="flex flex-col items-center gap-6 md:gap-8 w-full md:items-start text-black lg:w-10/12">
        <p>Délai de réponse rapide</p>
        <p>
          {reviewsCount === 0 ? 'Aucun avis' : 
           <span className="flex items-center">
             <span className="text-yellow-400 mr-1">★</span>
             {`${averageRating.toFixed(1)}/5  (${reviewsCount} avis)`}
           </span>}
        </p>
      </div>
      <Separator className="bg-[#949393]" />
      
      <div className="flex flex-col w-full items-center md:items-start text-black lg:w-10/12">
        <h2 className="text-[#4e598c]">Description</h2>
        <textarea
          placeholder="Ajoutez une description"
          className="mt-4 border rounded p-2 w-full h-32 text-justify bg-white md:bg-transparent"
          {...register("description")}
        />
      </div>

      <div className="flex gap-4 mt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
        <Button
          type="button"
          className="text-forecast hover:no-underline hover:opacity-70"
          onClick={() => onCancel(false)}
          disabled={isSubmitting}
          variant={"link"}
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}