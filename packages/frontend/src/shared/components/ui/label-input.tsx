import { forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';
import { Input } from './input';

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
  setState?: (state: boolean) => void;
  state?: boolean;
}

const LabelInput = forwardRef<HTMLInputElement, LabelInputProps>(
  ({ leftLabel, rightLabel, className, setState, state, ...rest }, ref) => {
    return (
      <div className="relative flex flex-row items-center">
        <Input
          ref={ref}
          type="text"
          className={cn(
            'h-12 w-full rounded-xl text-base',
            leftLabel && 'pl-[95px]',
            rightLabel && 'pr-[95px]',
            className
          )}
          {...rest}
        />

        {leftLabel && (
          <div className="absolute left-0 flex h-full max-w-[83px] items-center">
            <span className="flex h-full w-[83px] items-center border-r border-neutral-light-300 px-4 text-base text-neutral-dark-100">
              {leftLabel}
            </span>
          </div>
        )}

        {rightLabel && (
          <div
            className="absolute right-0 flex h-full cursor-pointer items-center px-3"
            onClick={() => setState?.(!state)}
          >
            <span className="flex h-full w-[83px] items-center border-l border-neutral-light-300 text-base text-neutral-dark-100">
              {rightLabel}
            </span>
          </div>
        )}
      </div>
    );
  }
);

// Add display name for better debugging
LabelInput.displayName = 'LabelInput';

export { LabelInput };
