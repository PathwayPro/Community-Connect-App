import { Separator } from '@/shared/components/ui/separator';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import React, { Fragment } from 'react';

interface StepperIndicatorProps {
  activeStep: number;
  totalSteps: number;
}

const StepperIndicator = ({
  activeStep,
  totalSteps
}: StepperIndicatorProps) => {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div key={index} className={clsx('m-4 h-2 w-16 rounded-full')}>
          {index >= activeStep ? (
            <div className="h-2 w-16 rounded-full bg-neutral-light-300"></div>
          ) : (
            <div className="h-2 w-16 rounded-full bg-secondary-100"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepperIndicator;
