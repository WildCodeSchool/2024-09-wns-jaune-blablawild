import VanImage from "@/assets/van-image-trip-form.png";
import { Stepper } from "@/components/Stepper/Stepper";
import Confirmation from "@/components/tripForm/Confirmation";
import DepartureHour from "@/components/tripForm/DepartureHour";
import Destination from "@/components/tripForm/Destination";
import NumberPassengers from "@/components/tripForm/NumberPassengers";
import PriceSelection from "@/components/tripForm/PriceSelection";
import TravelOrigin from "@/components/tripForm/TravelOrigin";
import TripDateSelection from "@/components/tripForm/TripDateSelection";
import TripSummary from "@/components/tripForm/TripSummary";
import { Button } from "@/components/ui/button";
import { useCreateTripMutation } from "@/graphql/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { setHours, setMinutes } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../components/ui/form";
import { useMultiStepsForm } from "../hooks/useMultiStepsForm";

const formSchema = z.object({
  departureCity: z.string(),
  arrivalCity: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }),
  departureDate: z.date(),
  price: z.number(),
  passengers: z.number(),
});

export default function TripForm() {
  const [createTrip] = useCreateTripMutation();
  const [departureHour, setDepartureHour] = useState(10);
  const [departureMinutes, setDepartureMinutes] = useState(20);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);

  const steps = [
    { id: "destination", label: "Destination" },
    { id: "origin", label: "Départ" },
    { id: "date", label: "Date" },
    { id: "hour", label: "Heure" },
    { id: "passengers", label: "Passagers" },
    { id: "price", label: "Prix" },
    { id: "summary", label: "Résumé" },
  ];

  const { step, back, next, currentStepIndex, isLastStep, goTo } =
    useMultiStepsForm([
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

  useEffect(() => {
    if (currentStepIndex > maxVisitedStep) {
      setMaxVisitedStep(currentStepIndex);
    }
  }, [currentStepIndex, maxVisitedStep]);

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

  return (
    <section className="flex gap-2 justify-center h-full bg-pr">
      <div className="flex-1 flex flex-col p-6">
        <div className="h-24">
          {!isSubmitted && (
            <Stepper
              steps={steps}
              currentStep={currentStepIndex}
              onStepChange={goTo}
              maxVisitedStep={maxVisitedStep}
            />
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center items-center min-h-[400px]">
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
                  type="button"
                  onClick={next}
                  className="w-30 bg-accent rounded-3xl p-5"
                >
                  Continuer
                </Button>
              )}
            </div>
          </Form>
        </div>
      </div>
      <div className="flex-1 md:block hidden">
        <img src={VanImage} alt="car image" className="object-cover h-full" />
      </div>
    </section>
  );
}
