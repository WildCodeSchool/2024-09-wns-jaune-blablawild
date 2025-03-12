import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { FormControl, FormItem } from "../ui/form";
import { useFormContext } from "react-hook-form";
export default function TravelOrigin() {
  const {register} = useFormContext()
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold">
        D'ou partez vous ?
      </h1>
      <FormItem>
        <FormControl>
          <Input
            className={cn("w-md rounded-3xl border-primary border-2 mt-10")}
            {...register("departureCity")}
          />
        </FormControl>
      </FormItem>
    </div>
  );
}
