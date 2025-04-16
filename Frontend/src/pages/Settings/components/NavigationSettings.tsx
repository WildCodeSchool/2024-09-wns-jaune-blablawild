import { useNavigate } from "react-router-dom";
import LinkContent from "./LinkContent";
import { Separator } from "@/components/ui/separator";

type NavigationSettingsProps = {
  allSettings: {
    label: string;
    value: string;
    className?: string;
    showArrow?: boolean;
  }[];
  setActiveSettings: (value: string) => void;
  activeSettings: string;
};

export default function NavigationSettings({
  allSettings,
  setActiveSettings,
  activeSettings,
}: NavigationSettingsProps) {
  const navigate = useNavigate();
  const handleNavigate = (value: string) => {
    setActiveSettings(value);
    navigate(`/settings?tab=${value}`);
  };
  return (
    <section className="py-5">
      {allSettings.map((s, i) => (
        <>
          <div
            key={s.value}
            onClick={() => handleNavigate(s.value)}
            className={`cursor-pointer w-full h-15 flex items-center justify-center p-4 my-1 rounded-sm ${
              s.className
            } ${activeSettings === s.value && "bg-input"} hover:bg-input`}
          >
            <LinkContent label={s.label} showArrow={s.showArrow} />
          </div>
          {i !== allSettings.length - 1 && <Separator />}
        </>
      ))}
    </section>
  );
}
