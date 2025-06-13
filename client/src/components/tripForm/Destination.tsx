import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { FormControl, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";

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

export default function Destination() {
  const { register, setValue, watch } = useFormContext();
  const [suggestions, setSuggestions] = useState<AddressFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const arrivalCity = watch("arrivalCity") || "";

  useEffect(() => {
    if (!arrivalCity || arrivalCity.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(arrivalCity)}&limit=5`
        );
        const data: AddressResponse = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error("Erreur de recherche:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [arrivalCity]);

  const handleSelectSuggestion = (suggestion: AddressFeature) => {
    setValue("arrivalCity", suggestion.properties.label, {
      shouldValidate: true,
      shouldDirty: true,
    });
    
    setValue("arrivalCoordinates", {
      lat: suggestion.geometry.coordinates[1],
      lng: suggestion.geometry.coordinates[0],
    });
    
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const { ref, ...restRegister } = register("arrivalCity");

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold">Où allez-vous ?</h1>
      <FormItem className="relative w-full max-w-xs">
        <FormControl>
          <Input
            data-testid="destination-input"
            className={cn(
              "rounded-3xl border-primary border-2 mt-10 w-xs hover:border-accent"
            )}
            ref={ref} 
            {...restRegister} 
            onChange={(e) => {
              restRegister.onChange(e); 
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={(e) => {
              restRegister.onBlur(e); 
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            placeholder="Entrez une adresse..."
          />
        </FormControl>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 top-full mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.properties.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectSuggestion(suggestion);
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {suggestion.properties.label}
              </li>
            ))}
          </ul>
        )}
      </FormItem>
    </div>
  );
}