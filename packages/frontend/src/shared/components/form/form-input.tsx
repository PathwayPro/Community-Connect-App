import { Icons } from '@/features/auth/components/icons';
import { cn } from '@/shared/lib/utils';
import { Input } from '../ui/input';
import { IconInput } from '@/shared/components/ui/icon-input';
import { LabelInput } from '@/shared/components/ui/label-input';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/shared/components/ui/form';
import { Control } from 'react-hook-form';

interface FormInputProps {
  name: string;
  label: string;
  placeholder: string;
  customError?: string;
  hasInputIcon?: boolean;
  hasLabelInput?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  leftLabel?: string;
  rightLabel?: string;
  control?: Control<any>;
  required?: boolean;
}

export const FormInput = ({
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
  required = false
}: FormInputProps) => {
  const formContext = useFormContext();
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
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel
            className={cn(
              'text-paragraph-sm font-medium text-neutral-dark-600',
              required && 'after:content-["*"]'
            )}
          >
            {label}
          </FormLabel>
          <FormControl>
            {hasInputIcon ? (
              <IconInput
                placeholder={placeholder}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
                className={cn(
                  'w-full bg-neutral-light-100',
                  inputError && 'border-red-500 focus-visible:ring-red-100'
                )}
                {...field}
              />
            ) : hasLabelInput ? (
              <LabelInput
                placeholder={placeholder}
                leftLabel={leftLabel}
                rightLabel={rightLabel}
                className={cn(
                  'w-full bg-neutral-light-100',
                  inputError && 'border-red-500 focus-visible:ring-red-100'
                )}
                {...field}
              />
            ) : (
              <Input
                placeholder={placeholder}
                className={cn(
                  'w-full bg-neutral-light-100',
                  inputError && 'border-red-500 focus-visible:ring-red-100'
                )}
                {...field}
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
