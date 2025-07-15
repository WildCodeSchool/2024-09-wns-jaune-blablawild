import { ChevronDown, ChevronUp } from "lucide-react";
import { FormItem } from "../ui/form";
import { useFormContext } from "react-hook-form";
import { isAfter, set } from "date-fns";

type departureHourProps = {
  departureHour: number;
  setDepartureHour: (value: number) => void;
  departureMinutes: number;
  setDepartureMinutes: (value: number) => void;
};

export default function DepartureHour({
  departureHour,
  setDepartureHour,
  departureMinutes,
  setDepartureMinutes,
}: departureHourProps) {
  const form = useFormContext();

  const isTimeInFuture = (hour: number, minutes: number) => {
    const selectedDate = new Date(form.getValues().departureDate);
    const now = new Date();
    
    if (selectedDate.toDateString() !== now.toDateString()) {
      return selectedDate > now;
    }
    
    const selectedDateTime = set(selectedDate, {
      hours: hour,
      minutes: minutes,
      seconds: 0,
      milliseconds: 0
    });
    
    return isAfter(selectedDateTime, now);
  };

  const changeHour = (increment: boolean) => {
    const newHour = increment 
      ? (departureHour + 1) % 24 
      : (departureHour - 1 + 24) % 24;
    
    if (isTimeInFuture(newHour, departureMinutes)) {
      setDepartureHour(newHour);
    }
  };

  const changeMinutes = (increment: boolean) => {
    const newMinutes = increment 
      ? (departureMinutes + 5) % 60 
      : (departureMinutes - 5 + 60) % 60;
    
    if (isTimeInFuture(departureHour, newMinutes)) {
      setDepartureMinutes(newMinutes);
    }
  };

  return (
    <section className="flex gap-3 flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold text-center">
        A quelle heure retrouvez-vous vos passagers ?
      </h1>
      <FormItem>
        <div className="flex gap-5 mt-5 justify-center items-center border-2 border-accent rounded-4xl md:w-[25vw] px-10 py-2">
          <div className="flex flex-col items-center text-[40px]">
            <ChevronUp
              onClick={() => changeHour(true)}
              className="cursor-pointer hover:text-accent transition-colors"
            />
            <div>{departureHour.toString().padStart(2, '0')}</div>
            <ChevronDown
              onClick={() => changeHour(false)}
              className="cursor-pointer hover:text-accent transition-colors"
            />
          </div>
          <p className="text-[40px]">:</p>
          <div className="flex flex-col items-center text-[40px]">
            <ChevronUp
              onClick={() => changeMinutes(true)}
              className="cursor-pointer hover:text-accent transition-colors"
            />
            <div>{departureMinutes.toString().padStart(2, '0')}</div>
            <ChevronDown
              onClick={() => changeMinutes(false)}
              className="cursor-pointer hover:text-accent transition-colors"
            />
          </div>
        </div>
      </FormItem>
    </section>
  );
}