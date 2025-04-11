import { TimeOption } from "@/graphql/hooks";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

type FilterSideBarProps = {   
  onSortChange: (sort: string | null) => void;   
  onTimeRangeChange: (timeRanges: TimeOption[]) => void;
  currentSort: string | null;   
  currentTimeRange: TimeOption[];
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

  const handleTimeRangeToggle = (timeOption: TimeOption) => {
    let newTimeRanges: TimeOption[];
    
    if (currentTimeRange.includes(timeOption)) {
      newTimeRanges = currentTimeRange.filter(item => item !== timeOption);
    } else {
      newTimeRanges = [...currentTimeRange, timeOption];
    }
    
    onTimeRangeChange(newTimeRanges);
  };

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
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="before6" 
              checked={currentTimeRange.includes(TimeOption.Before_6)}
              onCheckedChange={() => handleTimeRangeToggle(TimeOption.Before_6)}
            />
            <Label htmlFor="before6" className={labelClassName}>Avant 6h</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="from6to12"
              checked={currentTimeRange.includes(TimeOption.From_6To_12)}
              onCheckedChange={() => handleTimeRangeToggle(TimeOption.From_6To_12)}
            />
            <Label htmlFor="from6to12" className={labelClassName}>Entre 6h et 12h</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="from12to18"
              checked={currentTimeRange.includes(TimeOption.From_12To_18)}
              onCheckedChange={() => handleTimeRangeToggle(TimeOption.From_12To_18)}
            />
            <Label htmlFor="from12to18" className={labelClassName}>Entre 12h et 18h</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="after18"
              checked={currentTimeRange.includes(TimeOption.After_18)}
              onCheckedChange={() => handleTimeRangeToggle(TimeOption.After_18)}
            />
            <Label htmlFor="after18" className={labelClassName}>Après 18h</Label>
          </div>
        </div>
      </div>
    </section>
  ); 
};