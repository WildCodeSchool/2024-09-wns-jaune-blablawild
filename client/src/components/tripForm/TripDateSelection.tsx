import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { FormControl, FormItem } from "../ui/form";
import { useFormContext } from "react-hook-form";
import { fr } from "date-fns/locale";
import { getHours, getMinutes, set, startOfToday } from "date-fns";

export default function TripDateSelection() {
  const { setValue, watch } = useFormContext();
  const [date, setDate] = useState<Date | undefined>(
    watch("departureDate") || new Date()
  );

  useEffect(() => {
    if (date) {
      const currentDateTime = watch("departureDate");

      const newDateTime = set(date, {
        hours: getHours(currentDateTime),
        minutes: getMinutes(currentDateTime),
        seconds: 0,
        milliseconds: 0
      })

      setValue("departureDate", newDateTime);
    }
  }, [date, setValue, watch]);

  return (
    <div className="flex flex-col items-center gap-2 text-foreground shadow-none cursor-pointer hover:bg-[var(--hover)] md:px-2 md:py-2 px-3 py-4 md:rounded-lg">
      <h1 className="text-secondary text-xl font-semibold">
        Quand partez-vous ?
      </h1>
      <FormItem>
        <FormControl>
          <Calendar
            mode="single"
            locale={fr}
            selected={date}
            onSelect={setDate}
            fromDate={startOfToday()} 
            className="text-[#4e598c]"
            classNames={{
              day: "h-9 w-9 text-center p-0 font-normal cursor-pointer",
              day_selected: "rounded-md bg-[#ff8c42] text-white hover:bg-[#ff8c42] focus:bg-[#ff8c42]",
              day_today: "font-semibold text-[#ff8c42]",
              day_disabled: "text-gray-400 opacity-50",
            }}
          />
        </FormControl>
      </FormItem>
    </div>
  );
}
