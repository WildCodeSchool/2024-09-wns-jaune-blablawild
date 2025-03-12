import { Calendar } from "../ui/calendar";
import { useState } from "react";
import { FormControl, FormItem } from "../ui/form";
import { useFormContext } from "react-hook-form";

export default function TripDateSelection() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { register } = useFormContext()
  
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
