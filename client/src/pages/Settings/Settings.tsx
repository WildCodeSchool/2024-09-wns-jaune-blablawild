import { useState } from "react";
import UpdatePassword from "./components/UpdatePassword";
import { getUrlParams } from "@/utils";
import NavigationSettings from "./components/NavigationSettings";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import van_image from "@/assets/van-image-trip-form.png";

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
    <section className="flex min-h-screen">
      <div className="w-[15%] hidden lg:block">
        <img src={van_image} alt="van" className="h-full w-full object-cover" />
      </div>
      <div className="w-full lg:w-[70%] bg-white md:p-8 overflow-y-auto">
        {!activeSettings ? (
          <section className="h-full w-full flex flex-col gap-4">
            <h1 className="text-2xl my-4 px-6 md:px-0 md:text-3xl md:mb-8">Paramètres</h1>
            <NavigationSettings
              settingsGroups={settingsGroups}
              setActiveSettings={setActiveSettings}
              activeSettings={activeSettings}
            />
          </section>
        ) : (
          <section className="flex flex-col items-start justify-start gap-8 p-6">
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
      </div>
      <div className="w-[15%] hidden lg:block">
        <img
          src={van_image}
          alt="van"
          className="h-full w-full object-cover object-[75%_center]"
        />
      </div>
    </section>
  );
}