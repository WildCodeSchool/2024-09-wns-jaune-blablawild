import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

type AccordionBorderType = "top" | "bottom" | "top-bottom" | "none";
type RenderableElementType = React.ReactNode | React.JSX.Element;

type AccordionCustomIconType = {
  active?: RenderableElementType;
  inactive?: RenderableElementType;
};

type AccordionPropsType = {
  title: string | RenderableElementType;
  children: RenderableElementType;
  border?: AccordionBorderType;
  customIcon?: AccordionCustomIconType;
  displayIcon?: boolean;
  accordionStyle?: string;
  contentClassname?: string;
  iconSize?: number;
  titleStyle?: string;
  initiallyOpen?: boolean;
};

export function Accordion({ children, ...props }: AccordionPropsType) {
  const {
    title,
    titleStyle,
    accordionStyle,
    contentClassname,
    initiallyOpen,
    displayIcon = true,
    iconSize = 24,
    customIcon,
    border = "none",
  } = props;

  let borderClass = "";
  if (border === "top-bottom") {
    borderClass = "border-y border-solid border-border";
  } else if (border === "top") {
    borderClass = "border-t border-solid border-border";
  } else if (border === "bottom") {
    borderClass = "border-b border-solid border-border";
  }

  const IconComponent = () => {
    if (!displayIcon) return null;

    if (customIcon) {
      return <div className="accordion-icon">{customIcon.inactive}</div>;
    }

    return <ChevronDown size={iconSize} />;
  };

  return (
    <div className={borderClass}>
      <AccordionPrimitive.Root type="single" collapsible defaultValue={initiallyOpen ? "item-1" : undefined}>
        <AccordionPrimitive.Item value="item-1" className="border-none">
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger className={`py-6 flex w-full items-center justify-between ${accordionStyle}`}>
              <span className={titleStyle}>{title}</span>
              {displayIcon && <IconComponent />}
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className={contentClassname}>
            {children}
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      </AccordionPrimitive.Root>
    </div>
  );
}
