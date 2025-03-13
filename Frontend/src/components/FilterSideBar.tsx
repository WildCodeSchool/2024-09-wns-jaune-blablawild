import { useState } from "react";
import { Checkbox } from "./ui/checkbox";

export const FilterSideBar = () => {
  const [selectedSort, setSelectedSort] = useState<null | string>(null);
  const [selectedTime, setSelectedTime] = useState<null | string>(null);

  const filterGroups = [
    {
      title: "Trier par",
      options: ["Départ le plus tôt", "Prix le plus bas"],
      selected: selectedSort,
      setSelected: setSelectedSort,
    },
    {
      title: "Heure de départ",
      options: ["Avant 6h", "Entre 6h et 12h", "Entre 12h et 18h", "Après 18h"],
      selected: selectedTime,
      setSelected: setSelectedTime,
    }
  ];

  return (
    <section className="bg-secondary max-w-[318px] h-full p-7 space-y-12">
      {filterGroups.map((group) => (
        <div key={group.title}>
          <h1 className="text-white font-semibold mb-5 md:text-lg">
            {group.title}
          </h1>
          <div className="space-y-4">
            {group.options.map((option) => (
              <Checkbox 
                key={option} 
                label={option} 
                labelClassName="text-white"
                checked={group.selected === option}
                onCheckedChange={(checked) => {
                  if (checked) {
                    group.setSelected(option);
                  } else if (group.selected === option) {
                    group.setSelected(null);
                  }
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};