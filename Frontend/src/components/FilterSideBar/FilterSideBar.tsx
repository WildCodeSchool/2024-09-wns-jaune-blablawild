import { TimeOption } from "@/pages/SearchTrip";
import { Checkbox } from "../ui/checkbox";

type FilterSideBarProps = {
  onSortChange: (sort: string | null) => void;
  onTimeRangeChange: (timeRange: TimeOption | null) => void; 
  currentSort: string | null;
  currentTimeRange: TimeOption | null; 
};

export const FilterSideBar = ({
  onSortChange,
  onTimeRangeChange,
  currentSort,
  currentTimeRange
}: FilterSideBarProps) => {
  return (
    <section className="px-7 py-5 bg-secondary w-full h-full md:p-7 md:block space-y-12">
      <div>
        <h1 className="text-white font-semibold mb-5 md:text-lg">Trier par</h1>
        <div className="space-y-4">
          <Checkbox 
            label="Départ le plus tôt" 
            labelClassName="text-white" 
            checked={currentSort === "earliest"}
            onCheckedChange={(checked) => {
              if (checked) {
                onSortChange("earliest");
                onTimeRangeChange(null);
              }
            }}
          />
          <Checkbox 
            label="Prix le plus bas" 
            labelClassName="text-white" 
            checked={currentSort === "cheapest"}
            onCheckedChange={(checked) => {
              if (checked) {
                onSortChange("cheapest");
                onTimeRangeChange(null);
              }
            }}
          />
        </div>
      </div>
      
      <div>
        <h1 className="text-white font-semibold mb-5 md:text-lg">
          Heure de départ
        </h1>
        <div className="space-y-4">
          <Checkbox 
            label="Avant 6h" 
            labelClassName="text-white" 
            checked={currentTimeRange === TimeOption.BEFORE_6}
            onCheckedChange={(checked) => {
              if (checked) {
                onTimeRangeChange(TimeOption.BEFORE_6);
                onSortChange(null);
              }
            }}
          />
          <Checkbox 
            label="Entre 6h et 12h" 
            labelClassName="text-white" 
            checked={currentTimeRange === TimeOption.FROM_6_TO_12}
            onCheckedChange={(checked) => {
              if (checked) {
                onTimeRangeChange(TimeOption.FROM_6_TO_12);
                onSortChange(null);
              }
            }}
          />
          <Checkbox 
            label="Entre 12h et 18h" 
            labelClassName="text-white" 
            checked={currentTimeRange === TimeOption.FROM_12_TO_18}
            onCheckedChange={(checked) => {
              if (checked) {
                onTimeRangeChange(TimeOption.FROM_12_TO_18);
                onSortChange(null);
              }
            }}
          />
          <Checkbox 
            label="Après 18h" 
            labelClassName="text-white" 
            checked={currentTimeRange === TimeOption.AFTER_18}
            onCheckedChange={(checked) => {
              if (checked) {
                onTimeRangeChange(TimeOption.AFTER_18);
                onSortChange(null);
              }
            }}
          />
        </div>
      </div>
    </section>
  );
};