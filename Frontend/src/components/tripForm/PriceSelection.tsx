import { useFormContext } from "react-hook-form";
import { FormControl, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
export default function PriceSelection() {
const { register } = useFormContext()
  return (
    <section className="flex flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold">
        Fixer votre prix par place
      </h1>
      <FormItem>
        <FormControl>
          <Input
            className={cn("w-s rounded-3xl border-primary border-2 mt-10")}
            {...register("price", {
              setValueAs: (value) => (value ? Number(value) : undefined),
            })}
            type="number"
          />
        </FormControl>
      </FormItem>
    </section>
  );
}
