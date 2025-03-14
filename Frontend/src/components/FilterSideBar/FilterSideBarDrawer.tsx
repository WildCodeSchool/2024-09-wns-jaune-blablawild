import { TimeOption } from "@/pages/SearchTrip";
import { Menu } from "lucide-react";
import { FilterSideBar } from "./FilterSideBar";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter,
} from "../ui/drawer";
import { Button } from "../ui/button";
type MobileFilterDrawerProps = {
  onSortChange: (sort: string | null) => void;
  onTimeRangeChange: (timeRange: TimeOption | null) => void;
  currentSort: string | null;
  currentTimeRange: TimeOption | null;
};

export const MobileFilterDrawer = ({
  onSortChange,
  onTimeRangeChange,
  currentSort,
  currentTimeRange,
}: MobileFilterDrawerProps) => {
  return (
    <div className="md:hidden pt-3 ml-5">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="border-none shadow-none">
            <Menu size={16} />
            <span>Filtres</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-secondary">
          <div className="px-4 pb-4">
            <FilterSideBar
              onSortChange={onSortChange}
              onTimeRangeChange={onTimeRangeChange}
              currentSort={currentSort}
              currentTimeRange={currentTimeRange}
            />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="rounded-full text-secondary mx-6">Fermer</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
