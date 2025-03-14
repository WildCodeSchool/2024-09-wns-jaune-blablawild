import { ReactElement, useState } from "react";
export function useMultiStepsForm(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function next() {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  }

  function back() {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  }

  function goTo(index: number) {
    setCurrentStepIndex(index);
  }

  return {
    currentStepIndex,
    steps,
    step: steps[currentStepIndex],
    goTo,
    next,
    back,
    isLastStep: currentStepIndex === steps.length - 1,
  };
}
