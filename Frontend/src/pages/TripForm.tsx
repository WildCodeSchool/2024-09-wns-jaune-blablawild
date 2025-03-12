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

const formSchema = z.object({
  departureCity: z.string(),
  arrivalCity: z.string(),
  departureDate: z.date(),
  departureHour: z.number(),
  price: z.number(),
  passengers: z.number(),
});

export default function TripForm() {
  const { step, back, next, currentStepIndex, isLastStep } = useMultiStepsForm([
    <Destination />,
    <TravelOrigin />,
    <TripDateSelection />,
    <DepartureHour />,
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
      departureHour: 0,
      price: 0,
      passengers: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  return (
    <section className="flex gap-2 justify-center item-center bg-pr h-screen">
      <div className="flex-1 flex flex-col justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step}
            <Button type="submit">Submit</Button>
            <div className="flex gap-5 m-10 justify-center">
              {currentStepIndex !== 0 && (
                <Button
                  onClick={back}
                  className="w-30 bg-muted rounded-3xl p-5 text-accent"
                  variant="outline"
                >
                  Précédent
                </Button>
              )}
              <Button onClick={next} className="w-30 bg-accent rounded-3xl p-5">
                {isLastStep ? "Valdier" : "Continuer"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="flex-1">
        <img src={VanImage} alt="car image" className="object-cover h-full" />
      </div>
    </section>
  );
}
