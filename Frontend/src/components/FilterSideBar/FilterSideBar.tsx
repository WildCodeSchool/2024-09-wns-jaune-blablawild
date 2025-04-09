import { TimeOption } from "@/graphql/hooks";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

type FilterSideBarProps = {   
  onSortChange: (sort: string | null) => void;   
  onTimeRangeChange: (timeRange: TimeOption | null) => void;    
  currentSort: string | null;   
  currentTimeRange: TimeOption | null; 
  onReinstateChange: () => void; 
};  

export const FilterSideBar = ({   
  onSortChange,   
  onReinstateChange,
  onTimeRangeChange,   
  currentSort,   
  currentTimeRange 
}: FilterSideBarProps) => {   
  const labelClassName = "md:text-white text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

  return (     
    <section className="px-7 py-5 bg-white md:bg-secondary w-full h-full md:h-screen md:p-7 md:block space-y-12 overflow-auto">       
      <div>   
      <Button className="bg-transparent px-0 shadow-none mb-6" onClick={onReinstateChange}>Réinitialiser les filtres</Button>
      
        <h1 className="md:text-white font-semibold mb-5 md:text-lg">Trier par</h1>         
        <RadioGroup 
          value={currentSort || ""}
          onValueChange={(value) => {
            if (value) {
              onSortChange(value);
            } else {
              onSortChange(null);
            }
          }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="earliest" id="earliest" />
            <Label htmlFor="earliest" className={labelClassName}>Départ le plus tôt</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cheapest" id="cheapest" />
            <Label htmlFor="cheapest" className={labelClassName}>Prix le plus bas</Label>
          </div>
        </RadioGroup>
      </div>              
      <div>         
        <h1 className="md:text-white font-semibold mb-5 md:text-lg">           
          Heure de départ         
        </h1>         
        <RadioGroup 
          value={currentTimeRange || ""}
          onValueChange={(value) => {
            if (value) {
              onTimeRangeChange(value as TimeOption);
            } else {
              onTimeRangeChange(null);
            }
          }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={TimeOption.Before_6} id="before6" />
            <Label htmlFor="before6" className={labelClassName}>Avant 6h</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={TimeOption.From_6To_12} id="from6to12" />
            <Label htmlFor="from6to12" className={labelClassName}>Entre 6h et 12h</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={TimeOption.From_12To_18} id="from12to18" />
            <Label htmlFor="from12to18" className={labelClassName}>Entre 12h et 18h</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={TimeOption.After_18} id="after18" />
            <Label htmlFor="after18" className={labelClassName}>Après 18h</Label>
          </div>
        </RadioGroup>
      </div>
    </section>   
  ); 
};