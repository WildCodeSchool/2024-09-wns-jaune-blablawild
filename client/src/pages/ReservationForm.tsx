import { useMultiStepsForm } from "../hooks/useMultiStepsForm";
import VanImage from "@/assets/van-image-trip-form.png";
import SeatSelection from "@/components/reservationForm/SeatSelection";
import ReservationSummary from "@/components/reservationForm/ReservationSummary";
import Confirmation from "@/components/reservationForm/Confirmation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useGetTripByIdQuery } from "@/graphql/hooks";
import { Form } from "@/components/ui/form";
import { useBookTripMutation } from "@/graphql/hooks";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/store/useUserStore";
import { Step } from "@/components/Stepper/types";
import { useToast } from "@/contexts/ToasterContext";

interface UserState {
  user: {
    id: string | number;
  } | null;
}

const buildFormSchema = (capacity: number) =>
  z.object({
    seatsCount: z
      .number({ required_error: "Veuillez entrer un nombre de places" })
      .min(1, "Vous devez réserver au moins une place")
      .max(capacity, `Vous ne pouvez pas réserver plus de ${capacity} places`),
  });

export default function ReservationForm() {
  const { id } = useParams();
  const toast = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookTrip] = useBookTripMutation();
  const currentUser = useUserStore((state: UserState) => state.user);

  const { data, loading, error } = useGetTripByIdQuery({
    variables: { tripId: id || "" },
    skip: !id,
  });

  const trip = data?.getTripById;
  const tripCapacity = trip?.capacity || 1;

  const form = useForm({
    resolver: zodResolver(buildFormSchema(tripCapacity)),
    defaultValues: {
      seatsCount: 1,
    },
  });
  
  const formSteps: Step[] = [
    {
      id: "seat-selection",
      label: "Sélection des sièges",
      component: (
        <SeatSelection
          departureTime={trip?.departure_time || ""}
          departureCity={trip?.departure_city || ""}
          arrivalCity={trip?.arrival_city || ""}
          availableSeats={trip?.capacity || 0}
        />
      ),
    },
    {
      id: "reservation-summary",
      label: "Récapitulatif",
      component: (
        <ReservationSummary
          departureTime={trip?.departure_time || ""}
          departureCity={trip?.departure_city || ""}
          arrivalCity={trip?.arrival_city || ""}
          arrivalAddress={trip?.arrival_address || ""}
          departureAddress={trip?.departure_address || ""}
        />
      ),
    },
  ];

  const { step, back, next, currentStepIndex, isLastStep } =
    useMultiStepsForm(formSteps);

  if (loading) return <div>Chargement en cours...</div>;
  if (error) return <div>Erreur: {error.message}</div>;
  if (!trip) return <p>Ce voyage n'existe pas</p>;

  type FormData = z.infer<ReturnType<typeof buildFormSchema>>;

  const onSubmit = async (values: FormData) => {
    try {
      await bookTrip({
        variables: {
          data: {
            tripId: id!,
            userId: currentUser?.id.toString() as string,
            seatsCount: values.seatsCount,
          },
        },
      });
      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <section className="flex gap-2 justify-center item-center bg-pr h-full">
      <div className="flex-1 flex flex-col justify-center items-center my-6">
        <Form {...form}>
          <div>
            {isSubmitted ? <Confirmation /> : step}
            <div className="flex justify-center items-center">
              {currentStepIndex !== 0 && (
                <Button
                  type="button"
                  onClick={back}
                  className={`w-30 text-accent bg-transparent rounded-3xl p-5 ${
                    isSubmitted ? "hidden" : ""
                  }`}
                  variant="outline"
                >
                  Précédent
                </Button>
              )}
              {isLastStep ? (
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <Button
                    type="submit"
                    className={`w-30 bg-accent rounded-3xl p-5 ${
                      isSubmitted ? "hidden" : ""
                    }`}
                  >
                    Réserver
                  </Button>
                </form>
              ) : (
                <Button
                  type="button"
                  onClick={next}
                  className="w-30 bg-accent rounded-3xl p-5"
                >
                  Continuer
                </Button>
              )}
            </div>
          </div>
        </Form>
      </div>
      <div className="flex-1 md:block hidden">
        <img src={VanImage} alt="car image" className="object-cover h-full" />
      </div>
    </section>
  );
}
