import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { FormControl, FormItem } from "../ui/form";
import { Input } from "../ui/input";
export default function TravelOrigin() {
  const { register } = useFormContext();
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold">
        D'où partez-vous ?
      </h1>
      <FormItem>
        <FormControl>
          <Input
            className={cn(
              "w-xs rounded-3xl border-primary border-2 mt-10 hover:border-accent"
            )}
            {...register("departureCity")}
          />
        </FormControl>
      </FormItem>
    </div>
  );
}
