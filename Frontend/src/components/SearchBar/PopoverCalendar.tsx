import { Calendar } from "../ui/calendar";
import { fr } from "date-fns/locale";

type PopoverCalendarProps = {
  selected: Date;
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
      disabled={{ before: new Date() }}
      locale={fr}
      selected={selected}
      onSelect={(date) => {
        if (date) {
          setSelected(new Date(date));
          if (onClose) onClose();
        }
      }}
    />
  );
}
