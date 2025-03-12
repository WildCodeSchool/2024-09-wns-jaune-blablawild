import { ChevronDown, ChevronUp } from "lucide-react";
export default function DepartureHour() {
  // date.setUTCHours(hours, minutes, seconds, milliseconds);
  return (
    <section className="flex gap-3 flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold">
        Combien de passagers voulez-vous transporter?
      </h1>
      <div className="flex gap-5 mt-5" >
      <div className="flex flex-col items-center">
        <ChevronUp />
        <div>10</div>
        <ChevronDown />
      </div>
      <div className="flex flex-col items-center">
        <ChevronUp />
        <div>20</div>
        <ChevronDown />
      </div>
      </div>
    </section>
  );
}
