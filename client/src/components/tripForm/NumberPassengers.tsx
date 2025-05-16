import { useEffect, useState } from "react";
// import { Button } from "../ui/button";
import { FormItem } from "../ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Minus, Plus } from "lucide-react";

export default function NumberPassengers() {
  const { register, setValue, watch } = useFormContext();
  const [numberPassengers, setNumberPassengers] = useState(
    watch("passengers") || 0
  );

  useEffect(() => {
    setValue("passengers", numberPassengers);
  }, [numberPassengers, setValue]);

  return (
    <section className="flex flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold text-center">
        Combien de passagers voulez-vous transportez ?
      </h1>
      <FormItem>
        <div className="flex items-center gap-10">
          <Minus
            color="#4e598c"
            onClick={() =>
              setNumberPassengers((prev: number) => Math.max(0, prev - 1))
            }
          />
          <p className="font-bold text-2xl text-foreground m-10">
            {numberPassengers}
          </p>
          <Plus
            data-testid="plus-button"
            color="#4e598c"
            onClick={() => setNumberPassengers((prev: number) => prev + 1)}
          />
        </div>
        <Input type="hidden" {...register("passengers")} />
      </FormItem>
    </section>
  );
}
