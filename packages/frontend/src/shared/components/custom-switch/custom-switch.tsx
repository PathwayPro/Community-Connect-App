import { cn } from '@/shared/lib/utils';

interface CustomSwitchOption<T> {
  label: string;
  value: T;
}

interface CustomSwitchProps<T> {
  options: CustomSwitchOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  className?: string;
  label?: string;
  required?: boolean;
  name?: string;
}

export function CustomSwitch<T>({
  options,
  value,
  onChange,
  className,
  label,
  required,
  name,
  ...inputProps
}: CustomSwitchProps<T>) {
  const activeIndex = options.findIndex((option) => option.value === value);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span
          className={cn(
            'text-sm font-medium text-neutral-dark-600',
            required && 'after:ml-1 after:content-["*"]'
          )}
        >
          {label}
        </span>
      )}
      <div
        className={cn(
          'relative flex h-12 w-auto cursor-pointer items-center rounded-2xl border-2 border-neutral-light-300 bg-muted p-1',
          className
        )}
      >
        {/* Hidden input for form functionality */}
        <input
          type="hidden"
          name={name}
          value={String(value)}
          {...inputProps}
        />

        {/* Sliding background */}
        <div
          className={cn(
            'absolute h-10 rounded-xl bg-primary transition-all duration-200',
            'border-neutral-light-100'
          )}
          style={{
            left: `${(activeIndex * 100) / options.length}%`,
            width: `${100 / options.length}%`
          }}
        />

        {/* Labels */}
        {options.map((option, index) => (
          <span
            key={index}
            onClick={() => onChange?.(option.value)}
            className={cn(
              'z-10 min-w-[120px] flex-1 px-2 text-center text-sm font-medium transition-colors duration-200',
              activeIndex === index
                ? 'text-primary-foreground'
                : 'text-muted-foreground'
            )}
          >
            {option.label}
          </span>
        ))}
      </div>
    </div>
  );
}
