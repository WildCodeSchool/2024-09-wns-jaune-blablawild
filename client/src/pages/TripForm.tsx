import VanImage from "@/assets/van-image-trip-form.png";
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
import { useUserStore } from "@/store/useUserStore";
import { useToast } from "@/contexts/ToasterContext";
import { Stepper } from "@/components/Stepper/Stepper";
import { DisplayMap } from "@/components/InteractiveMap";

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
    departureCoordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
    arrivalCoordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  })
  .refine((data) => data.departureCity !== data.arrivalCity, {
    message: "La ville de départ et d'arrivée ne peuvent pas être identiques",
    path: ["arrivalCity"],
  })
  .refine((data) => {
    const now = new Date();
    return data.departureDate > now;
  }, {
    message: "La date et l'heure de départ doivent être dans le futur",
    path: ["departureDate"],
  });
  
export default function TripForm() {
  const toast = useToast();
  const [createTrip] = useCreateTripMutation();
  
  const [departureHour, setDepartureHour] = useState(() => {
    const now = new Date();
    const futureTime = new Date(now.getTime() + 30 * 60000);
    return futureTime.getHours();
  });
  
  const [departureMinutes, setDepartureMinutes] = useState(() => {
    const now = new Date();
    const futureTime = new Date(now.getTime() + 30 * 60000);
    const minutes = futureTime.getMinutes();
    return Math.ceil(minutes / 5) * 5;
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const { user } = useUserStore();

  const steps = [
    {
      id: "destination",
      label: "Destination",
      component: <Destination />,
    },
    {
      id: "origin",
      label: "Départ",
      component: <TravelOrigin />,
    },
    {
      id: "date",
      label: "Date",
      component: <TripDateSelection />,
    },
    {
      id: "hour",
      label: "Heure",
      component: (
        <DepartureHour
          departureHour={departureHour}
          setDepartureHour={setDepartureHour}
          departureMinutes={departureMinutes}
          setDepartureMinutes={setDepartureMinutes}
        />
      ),
    },
    {
      id: "passengers",
      label: "Passagers",
      component: <NumberPassengers />,
    },
    {
      id: "price",
      label: "Prix",
      component: <PriceSelection />,
    },
    {
      id: "summary",
      label: "Résumé",
      component: <TripSummary />,
    },
  ];

  const { step, back, next, currentStepIndex, isLastStep, goTo } =
    useMultiStepsForm(steps);

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
          driverId: String(user?.id),
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
      case 3:
        const selectedDate = new Date(form.getValues().departureDate);
        const now = new Date();
        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(departureHour, departureMinutes, 0, 0);
        
        if (selectedDateTime <= now) {
          toast.error("L'heure de départ doit être dans le futur");
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

  const shouldShowMap = currentStepIndex === 0 || currentStepIndex === 1;

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
                  className={`w-30 text-accent bg-transparent rounded-3xl p-5 ${isSubmitted ? "hidden" : ""
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
                    className={`w-30 bg-accent rounded-3xl p-5 ${isSubmitted ? "hidden" : ""
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
      </div>

      <div className="flex-1 md:block hidden">
        {shouldShowMap ? (
          <DisplayMap
            departureCoordinates={form.watch("departureCoordinates")}
            arrivalCoordinates={form.watch("arrivalCoordinates")}
          />
        ) : (
          <img
            src={VanImage}
            alt="car image"
            className="object-cover h-full object-[65%_center]"
          />
        )}
      </div>
    </section>
  );
}