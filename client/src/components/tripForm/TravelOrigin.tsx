import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { FormControl, FormItem } from "../ui/form";
import SuggestionInput from "../SuggestionInput";

interface AddressFeature {
  properties: {
    id: string;
    label: string;
    name: string;
    housenumber?: string;
    street?: string;
    postcode: string;
    city: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface AddressResponse {
  features: AddressFeature[];
}

export default function TravelOrigin() {
  const { setValue, watch } = useFormContext();
  const departureCity = watch("departureCity") || "";

  // Fonction pour récupérer les suggestions
  const fetchSuggestions = async (query: string): Promise<AddressFeature[]> => {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
        query
      )}&limit=5`
    );
    const data: AddressResponse = await response.json();
    return data.features || [];
  };

  // Fonction appelée lors de la sélection d'une suggestion
  const handleSelectSuggestion = (suggestion: AddressFeature) => {
    setValue("departureCity", suggestion.properties.label, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("departureCoordinates", {
      lat: suggestion.geometry.coordinates[1],
      lng: suggestion.geometry.coordinates[0],
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold">
        D'où partez-vous ?
      </h1>
      <FormItem className="relative w-full max-w-xs">
        <FormControl>
          <SuggestionInput<AddressFeature>
            testId="departure-input"
            value={departureCity}
            onChange={(val) =>
              setValue("departureCity", val, { shouldDirty: true })
            }
            fetchSuggestions={fetchSuggestions}
            onSelect={handleSelectSuggestion}
            renderSuggestion={(s) => <>{s.properties.label}</>}
            placeholder="Adresse de départ"
            inputClassName={cn(
              "rounded-3xl border-primary border-2 mt-10 py-2 px-2 w-xs hover:border-accent"
            )}
          />
        </FormControl>
      </FormItem>
    </div>
  );
}
