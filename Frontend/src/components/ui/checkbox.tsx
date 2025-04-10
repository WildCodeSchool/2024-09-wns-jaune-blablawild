import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  label?: string;
  labelClassName?: string;
  checkboxColor?: string; 
  indicatorColor?: string; 
  borderColor?: string;
}

function Checkbox({
  className,
  label,
  labelClassName,
  id,
  checkboxColor = "bg-primary",
  indicatorColor = "bg-secondary md:bg-white",
  borderColor = "border-input",
  ...props
}: CheckboxProps) {
  const checkboxId = id || React.useId();
  
  const checkboxBgClass = checkboxColor; 
  const indicatorBgClass = indicatorColor;
  const borderClass = borderColor;
  
  return (
    <div className="flex items-center space-x-2">
      <CheckboxPrimitive.Root
        id={checkboxId}
        data-slot="checkbox"
        className={cn(
          "peer dark:bg-input/30 focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-xs border shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 relative",
          borderClass, 
          `data-[state=checked]:${checkboxBgClass}`, 
          "data-[state=checked]:text-primary-foreground",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="flex items-center justify-center text-current absolute inset-0"
        >
          <div className={cn(
            "size-2 rounded-xs mx-auto my-auto",
            indicatorBgClass
          )} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label
          htmlFor={checkboxId}
          className={cn(
            "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ml-1",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}

export { Checkbox }