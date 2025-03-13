import { ReactElement } from "react";

type FilterSideBarWrapperProps = {
    sidebar: ReactElement,
    children: ReactElement
}

export const FilterSideBarWrapper = ({ sidebar, children }: FilterSideBarWrapperProps) => {
  return (
    <div className="">
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="flex flex-row gap-6 py-8">
          <aside className="w-1/4 lg:w-1/5 sticky top-4 self-start">
            {sidebar}
          </aside>
          
          <main className="w-3/4 lg:w-4/5">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

