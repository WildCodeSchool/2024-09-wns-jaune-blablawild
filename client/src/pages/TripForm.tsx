import TravelOrigin from "@/components/tripForm/TravelOrigin";
import { Form } from "../components/ui/form";
import { useMultiStepsForm } from "../hooks/useMultiStepsForm";
import Destination from "@/components/tripForm/Destination";
import TripDateSelection from "@/components/tripForm/TripDateSelection";
import DepartureHour from "@/components/tripForm/DepartureHour";
import NumberPassengers from "@/components/tripForm/NumberPassengers";
import PriceSelection from "@/components/tripForm/PriceSelection";
import TripSummary from "@/components/tripForm/TripSummary";
import { Button } from "@/components/ui/button";
import VanImage from "@/assets/van-image-trip-form.png";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { setHours, setMinutes } from "date-fns";
import { useCreateTripMutation } from "@/graphql/hooks";
import Confirmation from "@/components/tripForm/Confirmation";
import { useToast } from "@/contexts/ToasterContext";

const formSchema = z
  .object({
    departureCity: z.string().min(1, "La ville de départ est requise"),
    arrivalCity: z
      .string({
        required_error: "La ville d'arrivée est requise",
        invalid_type_error: "La ville doit être une chaîne de caractères",
      })
      .min(1, "La ville d'arrivée est requise"),
    departureDate: z.date(),
    price: z.number().min(1, "Le prix doit être supérieur à 0"),
    passengers: z
      .number()
      .min(1, "Le nombre de passagers doit être au moins 1"),
  })
  .refine((data) => data.departureCity !== data.arrivalCity, {
    message: "La ville de départ et d'arrivée ne peuvent pas être identiques",
    path: ["arrivalCity"],
  });

export default function TripForm() {
  const toast = useToast();
  const [createTrip] = useCreateTripMutation();
  const [departureHour, setDepartureHour] = useState(10);
  const [departureMinutes, setDepartureMinutes] = useState(20);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { step, back, next, currentStepIndex, isLastStep } = useMultiStepsForm([
    <Destination />,
    <TravelOrigin />,
    <TripDateSelection />,
    <DepartureHour
      departureHour={departureHour}
      setDepartureHour={setDepartureHour}
      departureMinutes={departureMinutes}
      setDepartureMinutes={setDepartureMinutes}
    />,
    <NumberPassengers />,
    <PriceSelection />,
    <TripSummary />,
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departureCity: "",
      arrivalCity: "",
      departureDate: new Date(),
      price: 0,
      passengers: 0,
    },
  });

  useEffect(() => {
    let date = new Date(form.getValues().departureDate);
    date = setHours(date, departureHour);
    date = setMinutes(date, departureMinutes);
    form.setValue("departureDate", date);
  }, [departureHour, departureMinutes]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createTrip({
      variables: {
        data: {
          departure_city: data.departureCity,
          arrival_city: data.arrivalCity,
          departure_time: data.departureDate,
          price: data.price,
          capacity: data.passengers,
        },
      },
    }).then(() => {
      setIsSubmitted(true);
    });
  };

  const handleNextStep = () => {
    switch (currentStepIndex) {
      case 0:
        if (!form.getValues().arrivalCity) {
          toast.error("Veuillez sélectionner une ville d'arrivée");
          return;
        }
        break;
      case 1:
        if (!form.getValues().departureCity) {
          toast.error("Veuillez sélectionner une ville de départ");
          return;
        }
        if (form.getValues().departureCity === form.getValues().arrivalCity) {
          toast.error(
            "La ville de départ et d'arrivée ne peuvent pas être identiques"
          );
          return;
        }
        break;
      case 4:
        if (form.getValues().passengers <= 0) {
          toast.error("Le nombre de passagers doit être au moins 1");
          return;
        }
        break;
      case 5:
        if (form.getValues().price <= 0) {
          toast.error("Le prix doit être supérieur à 0");
          return;
        }
        break;
    }
    next();
  };

  return (
    <section className="flex gap-2 justify-center item-center bg-pr h-full">
      <div className="flex-1 flex flex-col justify-center items-center">
        <Form {...form}>
          {isSubmitted ? <Confirmation /> : step}
          <div className="flex gap-7 m-10 justify-center">
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
                  data-testid="publish-button"
                  type="submit"
                  className={`w-30 bg-accent rounded-3xl p-5 ${
                    isSubmitted ? "hidden" : ""
                  }`}
                >
                  Publier
                </Button>
              </form>
            ) : (
              <Button
                data-testid="continue-button"
                type="button"
                onClick={handleNextStep}
                className="w-30 bg-accent rounded-3xl p-5"
              >
                Continuer
              </Button>
            )}
          </div>
        </Form>
      </div>
      <div className="flex-1 md:block hidden">
        <img src={VanImage} alt="car image" className="object-cover h-full" />
      </div>
    </section>
  );
}
