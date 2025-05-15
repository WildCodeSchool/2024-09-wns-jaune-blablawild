import { Card } from "../ui/card";
import { FormItem } from "../ui/form";
import { TripLine } from "../ui/tripLine";

interface TripDetailsSummaryProps {
  departureTime: string;
  departureCity: string;
  arrivalCity: string;
}

export default function ReservationSummary({
  departureTime,
  departureCity,
  arrivalCity,
}: TripDetailsSummaryProps) {
  return (
    <section className="flex flex-col items-center gap-6 my-6">
      <h1 className="text-secondary text-xl font-semibold">
        Récapitulatif du trajet
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
      <FormItem>
        <Card className="bg-background shadow-none border-none"></Card>
      </FormItem>
    </section>
  );
}
