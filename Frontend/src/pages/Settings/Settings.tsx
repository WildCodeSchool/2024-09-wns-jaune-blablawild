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

  const settingsGroups = [
    {
      groupName: "profile",
      settings: [
        {
          label: "Mot de passe",
          value: "updatePassword",
        },
        {
          label: "Adresse postale",
          value: "updateAdress",
        },
      ],
    },
    {
      groupName: "preference",
      settings: [
        {
          label: "Préférences",
          value: "preferences",
        },
      ],
    },
    {
      groupName: "paiement",
      settings: [
        {
          label: "Modes de paiements",
          value: "paymentMethods",
        },
      ],
    },
    {
      groupName: "account",
      settings: [
        {
          label: "Déconnexion",
          value: "logout",
          className: "text-accent",
          showArrow: false,
        },
      ],
    },
  ];

  return (
    <section className="flex justify-center items-center w-full h-full">
      <section
        className={`${
          activeSettings ? "hidden" : "flex"
        } h-full w-full md:w-1/2 flex-col gap-4`}
      >
        <NavigationSettings
          settingsGroups={settingsGroups}
          setActiveSettings={setActiveSettings}
          activeSettings={activeSettings}
        />
      </section>
      {activeSettings && (
        <section
          className={`md:w-1/2 w-full flex flex-col items-center justify-center gap-8 p-6`}
        >
          <div
            className="flex items-center justify-start w-full cursor-pointer"
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
