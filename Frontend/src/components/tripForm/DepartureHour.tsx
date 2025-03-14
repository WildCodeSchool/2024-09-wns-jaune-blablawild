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
      <h1 className="text-secondary text-xl font-semibold">
        A quelle heure retrouvez-vous vos passagers ?
      </h1>
      <FormItem>
        <div className="flex gap-5 mt-5">
          <div className="flex flex-col items-center">
            <ChevronUp
              onClick={() => setDepartureHour((departureHour + 1) % 24)}
            />
            <div>{departureHour}</div>
            <ChevronDown
              onClick={() => setDepartureHour((departureHour - 1 + 24) % 24)}
            />
          </div>
          <div className="flex flex-col items-center">
            <ChevronUp
              onClick={() => setDepartureMinutes((departureMinutes + 10) % 60)}
            />
            <div>{departureMinutes}</div>
            <ChevronDown
              onClick={() =>
                setDepartureMinutes((departureMinutes - 10 + 60) % 60)
              }
            />
          </div>
        </div>
      </FormItem>
    </section>
  );
}
