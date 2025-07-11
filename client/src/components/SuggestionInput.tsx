import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";

interface SuggestionInputProps<T> {
  value: string;
  onChange: (value: string) => void;
  fetchSuggestions: (query: string) => Promise<T[]>;
  onSelect: (suggestion: T) => void;
  renderSuggestion: (suggestion: T) => React.ReactNode;
  placeholder?: string;
  inputClassName?: string;
  testId?: string;
}

export default function SuggestionInput<T>({
  value,
  onChange,
  fetchSuggestions,
  onSelect,
  renderSuggestion,
  placeholder = "",
  inputClassName = "",
  testId = "",
}: SuggestionInputProps<T>) {
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const results = await fetchSuggestions(value);
        setSuggestions(results || []);
      } catch (error) {
        console.error(error);
        setSuggestions([]);
      }
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, fetchSuggestions]);

  return (
    <div className="relative w-full">
      <Input
        type="text"
        data-testid={testId}
        placeholder={placeholder}
        className={inputClassName}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 top-full mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                onSelect(suggestion);
                setShowSuggestions(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {renderSuggestion(suggestion)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
