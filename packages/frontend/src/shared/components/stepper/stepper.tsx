import clsx from 'clsx';

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
        <div
          key={index}
          className={clsx(
            'mx-2 h-1.5 w-10 rounded-full sm:mx-3 sm:h-2 sm:w-16 md:mx-4'
          )}
        >
          {index >= activeStep ? (
            <div className="h-1.5 w-10 rounded-full bg-neutral-light-300 sm:h-2 sm:w-16"></div>
          ) : (
            <div className="h-1.5 w-10 rounded-full bg-secondary-100 sm:h-2 sm:w-16"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepperIndicator;
