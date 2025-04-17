import { ChevronRight } from "lucide-react";

export default function LinkContent({
  label,
  showArrow = true,
}: {
  label: string;
  showArrow?: boolean;
}) {
  return (
    <div className="w-full h-full flex justify-between items-center">
      <p>{label}</p>
      {showArrow && <ChevronRight className="w-4 h-4" />}
    </div>
  );
}
