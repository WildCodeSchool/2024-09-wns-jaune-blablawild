import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Circle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FormItem } from "../ui/form";

function formatAddress(address: string) {
  if (!address) return { street: "", cityLine: "" };
  
  const match = address.match(/^(.+?)\s+(\d{5}\s+.+)$/);
  
  if (match) {
    return {
      street: match[1].trim(),
      cityLine: match[2].trim()
    };
  }
  
  return {
    street: address,
    cityLine: ""
  };
}

export default function TripSummary() {
  const { watch } = useFormContext();
  const departureCity = watch("departureCity");
  const arrivalCity = watch("arrivalCity");
  const departureDate = watch("departureDate");
  const price = watch("price");
  const passengers = watch("passengers");

  console.log(departureDate)

  const totalPrice = passengers * price;

  const formattedDeparture = formatAddress(departureCity);
  const formattedArrival = formatAddress(arrivalCity);

  return (
    <section className="lg:min-w-[400px]">
      <FormItem>
        <Card className="bg-background shadow-none border-none">
          <CardHeader className="flex justify-center">
            <CardTitle className="text-accent text-center text-2xl mb-2 ">
              Votre trajet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary">
              {departureDate
                ? format(departureDate, " d MMMM yyyy ", { locale: fr })
                : "Not set"}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-foreground mb-0">
                <p className="text-xl mr-1">
                  {format(departureDate, " HH:mm ", { locale: fr })}
                </p>
                <Circle size={10} />
                <div className="border-t border-foreground w-50"></div>
                <Circle size={10} />
              </div>
              <div className="text-foreground flex justify-between">
                <div className="flex-1">
                  <p className="font-medium">{formattedDeparture.street}</p>
                  {formattedDeparture.cityLine && (
                    <p className="text-sm">{formattedDeparture.cityLine}</p>
                  )}
                </div>
                <div className="flex-1 text-right">
                  <p className="font-medium">{formattedArrival.street}</p>
                  {formattedArrival.cityLine && (
                    <p className="text-sm">{formattedArrival.cityLine}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-8">
                <p className="text-secondary">Places disponibles</p>
                <p className="text-xl text-foreground">{passengers}</p>
              </div>
              <div className="flex gap-15">
                <p className="text-secondary">Tarif par place</p>
                <p className="text-xl text-foreground">{price} €</p>
              </div>
              <div className="flex gap-31">
                <p className="text-secondary">Total</p>
                <p className="text-xl text-foreground">{totalPrice} €</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FormItem>
    </section>
  );
}