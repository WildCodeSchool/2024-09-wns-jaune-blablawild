"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import * as React from "react";
import { StepperProps } from "./types";

export function Stepper({
  steps,
  currentStep,
  onStepChange,
  className,
  maxVisitedStep,
}: StepperProps) {
  const actualMaxVisitedStep = maxVisitedStep ?? currentStep;

  const handleStepChange = (targetStep: number) => {
    if (targetStep <= actualMaxVisitedStep) {
      onStepChange?.(targetStep);
    }
  };

  const getStepState = (index: number) => {
    const isCompleted = index < currentStep;
    const isCurrent = index === currentStep;
    const isVisitable = index <= actualMaxVisitedStep;
    const isFuture = !isVisitable;

    return { isCompleted, isCurrent, isVisitable, isFuture };
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const { isCompleted, isCurrent, isVisitable, isFuture } =
            getStepState(index);

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleStepChange(index)}
                  className={cn(
                    // Style Global
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all mb-2",

                    // Style pour les étapes complétées
                    isCompleted
                      ? "border-accent bg-accent text-white hover:cursor-pointer hover:bg-accent hover:text-white hover:ring-2 hover:ring-accent"
                      : // Style pour l'étape actuelle
                      isCurrent
                      ? "border-accent bg-white text-accent hover:cursor-pointer hover:bg-accent hover:text-white hover:ring-2 hover:ring-accent"
                      : // Style pour les étapes non visitables
                        "border-muted bg-white text-muted-foreground",

                    // Style pour les étapes visitables et non actuelle
                    isVisitable && !isCurrent && !isCompleted
                      ? "hover:cursor-pointer hover:border-accent hover:text-accent"
                      : "",

                    // Style pour les étapes futures
                    isFuture &&
                      "opacity-60 cursor-not-allowed hover:cursor-not-allowed"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                <span
                  className={cn(
                    "text-xs font-medium text-center max-w-[80px]",
                    index === currentStep
                      ? "text-accent"
                      : "text-muted-foreground",
                    isFuture && "opacity-60"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-1 flex-auto mx-2 rounded-full transition-all duration-300 self-start mt-5",
                    index < currentStep ? "bg-accent" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
