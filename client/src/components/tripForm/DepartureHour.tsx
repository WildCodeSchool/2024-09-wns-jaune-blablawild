import { ChevronDown, ChevronUp } from "lucide-react";
import { FormItem } from "../ui/form";

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
  return (
    <section className="flex gap-3 flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold text-center">
        A quelle heure retrouvez-vous vos passagers ?
      </h1>
      <FormItem>
        <div className="flex gap-5 mt-5 justify-center items-center border-2 border-accent rounded-4xl md:w-[25vw] px-10 py-2">
          <div className="flex flex-col items-center text-[40px]">
            <ChevronUp
              onClick={() => setDepartureHour((departureHour + 1) % 24)}
              className="cursor-pointer"
            />
            <div>{departureHour}</div>
            <ChevronDown
              onClick={() => setDepartureHour((departureHour - 1 + 24) % 24)}
              className="cursor-pointer"
            />
          </div>
          <p className="text-[40px]">:</p>
          <div className="flex flex-col items-center text-[40px]">
            <ChevronUp
              onClick={() => setDepartureMinutes((departureMinutes + 10) % 60)}
              className="cursor-pointer"
            />
            <div>{departureMinutes}</div>
            <ChevronDown
              onClick={() =>
                setDepartureMinutes((departureMinutes - 10 + 60) % 60)
              }
              className="cursor-pointer"
            />
          </div>
        </div>
      </FormItem>
    </section>
  );
}
