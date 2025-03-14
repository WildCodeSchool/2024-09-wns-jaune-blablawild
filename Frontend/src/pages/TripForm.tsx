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
  const [departureMinutes, setDepartureMinutes] = useState(0);
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

  return (
    <section className="flex gap-2 justify-center item-center bg-pr h-screen">
      <div className="flex-1 flex flex-col justify-center items-center">
        <Form {...form}>
          {isSubmitted ? <Confirmation /> : step}
          <div className="flex gap-5 m-10 justify-center">
            {currentStepIndex !== 0 && (
              <Button
                type="button"
                onClick={back}
                className={`w-30 bg-accent rounded-3xl p-5 ${
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
                  Valider
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
      <div className="flex-1 md:block hidden">
        <img src={VanImage} alt="car image" className="object-cover h-full" />
      </div>
    </section>
  );
}
