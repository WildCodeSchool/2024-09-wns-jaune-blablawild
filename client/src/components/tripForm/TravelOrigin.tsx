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

export default function TravelOrigin() {
  const { register, setValue, watch } = useFormContext();
  const [suggestions, setSuggestions] = useState<AddressFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const departureCity = watch("departureCity") || "";


  useEffect(() => {
    if (!departureCity || departureCity.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(departureCity)}&limit=5`
        );
        const data: AddressResponse = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error("Erreur de recherche:", error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [departureCity]);

 
  const handleSelectSuggestion = (suggestion: AddressFeature) => {
    setValue("departureCity", suggestion.properties.label, {
      shouldValidate: true,
      shouldDirty: true,
    });
    
    setValue("departureCoordinates", {
      lat: suggestion.geometry.coordinates[1], 
      lng: suggestion.geometry.coordinates[0],
    });
    
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const { ref, ...restRegister } = register("departureCity");

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-secondary text-xl font-semibold">
        D'où partez-vous ?
      </h1>
      <FormItem className="relative w-full max-w-xs">
        <FormControl>
          <Input
            data-testid="departure-input"
            className={cn(
              "w-xs rounded-3xl border-primary border-2 mt-10 hover:border-accent"
            )}
            ref={ref}
            {...restRegister}
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