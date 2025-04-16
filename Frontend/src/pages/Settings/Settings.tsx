import { useState } from "react";
import UpdatePassword from "./components/UpdatePassword";
import { getUrlParams } from "@/utils";
import NavigationSettings from "./components/NavigationSettings";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const params = getUrlParams();
  const [activeSettings, setActiveSettings] = useState<string>(params.tab);

  const allSettings = [
    {
      label: "Mot de passe",
      value: "updatePassword",
    },
    {
      label: "Déconnexion",
      value: "logout",
      className: "text-accent",
      showArrow: false,
    },
  ];
  return (
    <section className="h-full w-full flex flex-col md:flex-row">
      <section
        className={`${
          activeSettings ? "hidden" : "flex"
        } md:flex h-full w-full md:w-1/5 flex-col gap-4`}
      >
        <NavigationSettings
          allSettings={allSettings}
          setActiveSettings={setActiveSettings}
          activeSettings={activeSettings}
        />
      </section>
      {activeSettings && (
        <section
          className={`w-full md:w-1/2 flex flex-col items-center justify-center gap-8 p-6`}
        >
          <div
            className="flex items-center justify-start w-full md:hidden"
            onClick={() => {
              navigate("/settings");
              setActiveSettings("");
            }}
          >
            <ChevronLeft className="w-8 h-8" />
          </div>
          {activeSettings === "updatePassword" && <UpdatePassword />}
        </section>
      )}
    </section>
  );
}
