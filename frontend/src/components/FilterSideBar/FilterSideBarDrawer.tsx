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
import { TimeOption } from "@/graphql/hooks";
type MobileFilterDrawerProps = {
  onSortChange: (sort: string | null) => void;
  onTimeRangeChange: (timeRanges: TimeOption[]) => void;
  currentSort: string | null;
  currentTimeRange: TimeOption[];
  onReinstateChange: () => void;
};

export const MobileFilterDrawer = ({
  onSortChange,
  onTimeRangeChange,
  onReinstateChange,
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
        <DrawerContent className="bg-white">
          <div className="px-4 pb-4">
            <FilterSideBar
              onReinstateChange={onReinstateChange}
              onSortChange={onSortChange}
              onTimeRangeChange={onTimeRangeChange}
              currentSort={currentSort}
              currentTimeRange={currentTimeRange}
            />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="rounded-full bg-secondary text-white mx-6">Fermer</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
