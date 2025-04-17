import { useNavigate } from "react-router-dom";
import LinkContent from "./LinkContent";
import { Separator } from "@/components/ui/separator";

type SettingItem = {
  label: string;
  value: string;
  className?: string;
  showArrow?: boolean;
};

type SettingsGroup = {
  groupName: string;
  settings: SettingItem[];
};

type NavigationSettingsProps = {
  settingsGroups: SettingsGroup[];
  setActiveSettings: (value: string) => void;
  activeSettings: string;
};

export default function NavigationSettings({
  settingsGroups,
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
      {settingsGroups.map((group, groupIndex) => (
        <div key={group.groupName}>
          {group.settings.map((setting) => (
            <div
              key={setting.value}
              onClick={() => handleNavigate(setting.value)}
              className={`cursor-pointer w-full h-12 flex items-center justify-center p-4 my-1 rounded-2xl ${
                setting.className
              } ${
                activeSettings === setting.value && "bg-input"
              } hover:bg-input`}
            >
              <LinkContent
                label={setting.label}
                showArrow={setting.showArrow}
              />
            </div>
          ))}
          {groupIndex < settingsGroups.length - 1 && (
            <Separator className="my-3" />
          )}
        </div>
      ))}
    </section>
  );
}
