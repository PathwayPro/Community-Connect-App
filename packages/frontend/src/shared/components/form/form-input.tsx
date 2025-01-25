import { Icons } from '@/features/auth/components/icons';
import { cn } from '@/shared/lib/utils';
import { Input } from '../ui/input';
import { IconInput } from '@/shared/components/ui/icon-input';
import { LabelInput } from '@/shared/components/ui/label-input';
import { FieldValues, useFormContext, Control, Path } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/shared/components/ui/form';

interface FormInputProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder: string;
  customError?: string;
  hasInputIcon?: boolean;
  hasLabelInput?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  leftLabel?: string;
  rightLabel?: string;
  control?: Control<T>;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  min?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput = <T extends FieldValues>({
  name,
  label,
  placeholder,
  customError,
  hasInputIcon = false,
  hasLabelInput = false,
  leftIcon,
  rightIcon,
  leftLabel,
  rightLabel,
  control: controlProp,
  required = false,
  type,
  disabled = false,
  min,
  onChange
}: FormInputProps<T>) => {
  const formContext = useFormContext<T>();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormInput must be used within a FormProvider or with a control prop'
    );
    return null;
  }

  const errors = formContext?.formState?.errors || {};
  const inputError = errors[name];

  return (
    <FormField<T>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel
            className={cn(
              'text-paragraph-sm font-medium text-neutral-dark-600',
              disabled && 'text-neutral-dark-300',
              required && 'after:content-["*"]'
            )}
          >
            {label}
          </FormLabel>
          <FormControl>
            {hasInputIcon ? (
              <IconInput
                {...field}
                placeholder={placeholder}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                type={type}
                min={min}
                onChange={(e) => {
                  field.onChange(
                    type === 'number' ? Number(e.target.value) : e.target.value
                  );
                  onChange?.(e);
                }}
                className={cn(
                  'w-full bg-neutral-light-100',
                  inputError && 'border-red-500 focus-visible:ring-red-100',
                  disabled && 'bg-neutral-light-100'
                )}
                disabled={disabled}
              />
            ) : hasLabelInput ? (
              <LabelInput
                {...field}
                placeholder={placeholder}
                leftLabel={leftLabel}
                rightLabel={rightLabel}
                type={type}
                min={min}
                onChange={(e) => {
                  field.onChange(
                    type === 'number' ? Number(e.target.value) : e.target.value
                  );
                  onChange?.(e);
                }}
                className={cn(
                  'w-full bg-neutral-light-100',
                  inputError && 'border-red-500 focus-visible:ring-red-100',
                  disabled && 'bg-neutral-light-100'
                )}
                disabled={disabled}
              />
            ) : (
              <Input
                {...field}
                placeholder={placeholder}
                type={type}
                min={min}
                onChange={(e) => {
                  field.onChange(
                    type === 'number' ? Number(e.target.value) : e.target.value
                  );
                  onChange?.(e);
                }}
                className={cn(
                  'w-full bg-neutral-light-100',
                  inputError && 'border-red-500 focus-visible:ring-red-100',
                  disabled && 'bg-neutral-light-100'
                )}
                disabled={disabled}
              />
            )}
          </FormControl>
          {inputError && (
            <div className="flex flex-row items-center gap-2">
              <Icons.informationCircle className="h-4 w-4" />
              <p className="text-paragraph-sm text-error-500">{customError}</p>
            </div>
          )}
        </FormItem>
      )}
    />
  );
};
