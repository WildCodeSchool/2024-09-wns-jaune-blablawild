import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FormItem } from "../ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";

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
      <h1 className="text-secondary text-xl font-semibold">
        Combien de passagers voulez vous transportez ?
      </h1>
      <FormItem>
        <div className="flex items-center gap-10">
          <Button
            variant="default"
            size="icon"
            className="text-6xl text-ring border-none bg-background shadow-none hover:bg-transparent " //recentrer l'icone
            onClick={() =>
              setNumberPassengers((prev: number) => Math.max(0, prev - 1))
            }
          >
            -
          </Button>
          <p className="font-bold text-2xl text-foreground m-10">
            {numberPassengers}
          </p>
          <Button
            variant="default"
            size="icon"
            className="text-6xl text-ring border-none bg-background shadow-none hover:bg-transparent" //recentrer l'icone
            onClick={() => setNumberPassengers((prev: number) => prev + 1)}
          >
            +
          </Button>
        </div>
        <Input type="hidden" {...register("passengers")} />
      </FormItem>
    </section>
  );
}
