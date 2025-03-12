import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

export default function Destination() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold">Où allez-vous ?</h1>
      <Input className={cn("w-md rounded-3xl border-primary border-2 mt-10")}/>
    </div>
  );
}
