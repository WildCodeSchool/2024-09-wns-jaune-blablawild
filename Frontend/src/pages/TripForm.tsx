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

export default function TripForm() {
  const { step, back, next, currentStepIndex } = useMultiStepsForm([
    <Destination />,
    <TravelOrigin />,
    <TripDateSelection />,
    <DepartureHour />,
    <NumberPassengers />,
    <PriceSelection />,
    <TripSummary />,
  ]);
  return (
    <div className="flex gap-2 justify-center item-center bg-pr h-screen">
      <div className="flex-1 flex flex-col justify-center items-center">
        <Form>
          {step}
          <div className="flex gap-5 m-10">
            {currentStepIndex !== 0 && (
              <Button onClick={back} className="w-30 bg-muted rounded-3xl p-5 text-accent ">
                Précédent
              </Button>
            )}
            <Button onClick={next} className="w-30 bg-accent rounded-3xl p-5">
              Continuer
            </Button>
          </div>
        </Form>
      </div>
      <div className="flex-1">
        <img src={VanImage} alt="car image" className="object-cover h-full" />
      </div>
    </div>
  );
}
