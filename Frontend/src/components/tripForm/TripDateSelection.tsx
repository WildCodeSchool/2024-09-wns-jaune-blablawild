import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { FormControl, FormItem } from "../ui/form";
import { useFormContext } from "react-hook-form";

export default function TripDateSelection() {
  const { setValue, watch } = useFormContext();
  const [date, setDate] = useState<Date | undefined>(
    watch("departureDate") || new Date()
  );

  useEffect(() => {
    setValue("departureDate", date)
  }, [date, setValue])

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold">
        Quand partez vous ?
      </h1>
      <FormItem>
        <FormControl>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border mt-3"
          />
        </FormControl>
      </FormItem>
    </div>
  );
}
