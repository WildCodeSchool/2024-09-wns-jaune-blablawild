import { Calendar } from "../ui/calendar";
import { fr } from "date-fns/locale";

type PopoverCalendarProps = {
  selected: Date | null;
  setSelected: (value: Date) => void;
  onClose?: () => void;
};

export default function PopoverCalendar({
  selected,
  setSelected,
  onClose,
}: PopoverCalendarProps) {
  return (
    <Calendar
      mode="single"
      locale={fr}
      selected={selected || new Date()}
      onSelect={(date) => {
        if (date) {
          setSelected(new Date(date));
          if (onClose) onClose();
        }
      }}
    />
  );
}
