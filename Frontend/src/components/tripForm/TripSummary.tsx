import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Circle } from "lucide-react";
import { FormItem } from "../ui/form";

export default function TripSummary() {
  const { watch } = useFormContext();
  const departureCity = watch("departureCity");
  const arrivalCity = watch("arrivalCity");
  const departureDate = watch("departureDate");
  const price = watch("price");
  const passengers = watch("passengers");

  const totalPrice = passengers * price;
  console.log(departureDate);

  return (
    <section>
      <FormItem>
        <Card className="bg-background shadow-none border-none">
          <CardHeader className="flex justify-center bg-red">
            <CardTitle className="text-secondary text-xl font-semibold">
              Votre trajet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-accent">
              {departureDate
                ? format(departureDate, " d MMMM yyyy ", { locale: fr })
                : "Not set"}
            </p>
            <div className="flex items-center gap-1 text-foreground">
              <p>{format(departureDate, " hh : mm ", { locale: fr })}</p>
              <Circle size={15} />
              <div className="border-t border-foreground w-50"></div>
              <Circle size={15} />
            </div>
            <div className="text-foreground flex justify-between">
              <p>{departureCity}</p>
              <p>{arrivalCity}</p>
            </div>
            <div className="flex gap-8">
              <p className="text-accent">Places disponibles</p>
              <p className="text-foreground">{passengers}</p>
            </div>
            <div className="flex gap-15">
              <p className="text-accent">Tarif par place</p>
              <p className="text-foreground">{price} €</p>
            </div>
            <div className="flex gap-31">
              <p className="text-accent">Total</p>
              <p className="text-foreground">{totalPrice} €</p>
            </div>
          </CardContent>
        </Card>
      </FormItem>
    </section>
  );
}
