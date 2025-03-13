import { ReactElement } from "react";
import { FilterSideBar } from "./FilterSideBar";
import { TimeOption } from "@/pages/SearchTrip";

type FilterSideBarWrapperProps = {
  children: ReactElement;
  onSortChange: (sort: string | null) => void;
  onTimeRangeChange: (timeRange: TimeOption | null) => void; 
  currentSort: string | null;
  currentTimeRange: TimeOption | null; 
};

export const FilterSideBarWrapper = ({
  children,
  onSortChange,
  onTimeRangeChange,
  currentSort,
  currentTimeRange,
}: FilterSideBarWrapperProps) => {
  return (
    <div className="w-full">
      <div className="container relative">
        <div className="flex flex-row">
          <aside className="shrink-0 md:w-[220px] lg:w-[318px]">
            <FilterSideBar
              onSortChange={onSortChange}
              onTimeRangeChange={onTimeRangeChange}
              currentSort={currentSort}
              currentTimeRange={currentTimeRange}
            />
          </aside>
          <main className="flex-grow w-full">{children}</main>
        </div>
      </div>
    </div>
  );
};
