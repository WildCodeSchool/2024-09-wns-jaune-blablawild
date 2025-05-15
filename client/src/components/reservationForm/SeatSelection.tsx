import { useState, useEffect } from "react";
import { FormItem } from "../ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Minus, Plus } from "lucide-react";
import { TripLine } from "../ui/tripLine";

interface TripDetailsSummaryProps {
  departureTime: string;
  departureCity: string;
  arrivalCity: string;
  availableSeats: number;
}

export default function SeatSelection({
  departureTime,
  departureCity,
  arrivalCity,
  availableSeats,
}: TripDetailsSummaryProps) {
  const { register, setValue, watch } = useFormContext();

  const [numberPassengers, setNumberPassengers] = useState(
    watch("seatsCount") || 1
  );

  useEffect(() => {
    setValue("seatsCount", numberPassengers);
  }, [numberPassengers, setValue]);

  return (
    <section className="flex flex-col items-center gap-6 my-6">
      <h1 className="text-secondary text-xl font-semibold">
        Réservez votre trajet
      </h1>
      <div className="bg-background w-full sm:w-11/12 md:w-full lg:w-[480px] xl:w-[583px] border-[#E5E5E5] border-1 rounded-lg px-4 md:px-6 py-6 md:py-8 mb-6">
        <TripLine
          departureTime={departureTime || ""}
          departureCity={departureCity || ""}
          departureAddress="91 rue de charenton"
          arrivalTime={"2023-05-14T19:20:00Z"}
          arrivalCity={arrivalCity || ""}
          arrivalAddress="10 rue du bon"
          tripDuration="7h20"
        />
      </div>
      <FormItem className="w-full sm:w-11/12 md:w-full lg:w-[480px] xl:w-[583px]">
        <div className="flex items-center justify-between bg-white rounded-[12px] px-6 py-4 w-full">
          <label className="text-base text-[#444] font-medium whitespace-nowrap my-2">
            Nombre de sièges :
          </label>

          <div className="flex items-center justify-between gap-8 min-w-[120px]">
            <Minus
              className="cursor-pointer"
              size={24}
              color={numberPassengers <= 1 ? "#ccc" : "#4e598c"}
              onClick={() =>
                numberPassengers > 1 &&
                setNumberPassengers((prev: number) => prev - 1)
              }
            />
            <span className="text-2xl font-semibold text-[#4e598c]">
              {numberPassengers}
            </span>
            <Plus
              className="cursor-pointer"
              size={24}
              color={numberPassengers >= availableSeats ? "#ccc" : "#4e598c"}
              onClick={() =>
                numberPassengers < availableSeats &&
                setNumberPassengers((prev: number) => prev + 1)
              }
            />
          </div>
        </div>

        <Input
          type="hidden"
          {...register("seatsCount", { valueAsNumber: true })}
        />
      </FormItem>
    </section>
  );
}
