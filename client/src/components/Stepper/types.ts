export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  className?: string;
  maxVisitedStep?: number;
}

export interface Step {
  id: string | number;
  label: string;
  component: React.ReactElement;
}
