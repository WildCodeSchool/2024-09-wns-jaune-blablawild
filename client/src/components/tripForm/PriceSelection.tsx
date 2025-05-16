import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { FormControl, FormItem } from "../ui/form";
import { Input } from "../ui/input";
export default function PriceSelection() {
  const { register } = useFormContext();
  return (
    <section className="flex flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold">
        Fixer votre prix par place
      </h1>
      <FormItem>
        <FormControl>
          <Input
            data-testid="price-input"
            className={cn(
              "rounded-3xl border-primary border-2 mt-10 hover:border-accent"
            )}
            {...register("price", {
              setValueAs: (value) => (value ? Number(value) : 0),
            })}
            type="number"
          />
        </FormControl>
      </FormItem>
    </section>
  );
}
