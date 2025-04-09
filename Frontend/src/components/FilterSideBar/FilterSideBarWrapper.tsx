import { ReactElement } from "react";
import { FilterSideBar } from "./FilterSideBar";
import { MobileFilterDrawer } from "./FilterSideBarDrawer";
import { TimeOption } from "@/graphql/hooks";

type FilterSideBarWrapperProps = {
  children: ReactElement;
  onSortChange: (sort: string | null) => void;
  onTimeRangeChange: (timeRanges: TimeOption[]) => void;
  currentSort: string | null;
  currentTimeRange: TimeOption[];
  onReinstateChange: () => void;
};

export const FilterSideBarWrapper = ({
  children,
  onSortChange,
  onTimeRangeChange,
  onReinstateChange,
  currentSort,
  currentTimeRange,
}: FilterSideBarWrapperProps) => {
  return (
    <div className="w-full">
      <div className="container relative">
        <MobileFilterDrawer
          onReinstateChange={onReinstateChange}
          onSortChange={onSortChange}
          onTimeRangeChange={onTimeRangeChange}
          currentSort={currentSort}
          currentTimeRange={currentTimeRange}
        />
        
        <div className="flex flex-row min-h-screen">
          <aside className="hidden md:block shrink-0 md:w-[220px] lg:w-[318px] md:sticky md:top-0 md:self-start md:h-auto">
            <div className="h-full">
              <FilterSideBar
                onReinstateChange={onReinstateChange}
                onSortChange={onSortChange}
                onTimeRangeChange={onTimeRangeChange}
                currentSort={currentSort}
                currentTimeRange={currentTimeRange}
              />
            </div>
          </aside>
          
          <main className="flex-grow w-full">{children}</main>
        </div>
      </div>
    </div>
  );
};