import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"

interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  label?: string;
  labelClassName?: string;
}

function Checkbox({
  className,
  label,
  labelClassName,
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id || React.useId();
  
  return (
    <div className="flex items-center space-x-2">
      <CheckboxPrimitive.Root
        id={checkboxId}
        data-slot="checkbox"
        className={cn(
          "peer border-input dark:bg-input/30 data-[state=checked]:bg-white data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-white focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-full border shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 relative",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="flex items-center justify-center text-current absolute inset-0"
        >
          <div className="size-2 rounded-full bg-primary mx-auto my-auto" />
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