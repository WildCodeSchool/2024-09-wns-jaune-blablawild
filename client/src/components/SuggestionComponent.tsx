import { AddressFeature } from "./tripForm/Destination";

type SuggestionComponentProps = {
  suggestions: AddressFeature[];
  handleSelectSuggestion: (suggestion: AddressFeature) => void;
};

export default function SuggestionComponent({ suggestions, handleSelectSuggestion }: SuggestionComponentProps) {
  return (
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
  );
}
