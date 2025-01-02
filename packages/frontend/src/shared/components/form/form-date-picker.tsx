import { Icons } from '@/features/auth/components/icons';
import { cn } from '@/shared/lib/utils';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/shared/components/ui/form';
import { Control } from 'react-hook-form';
import { useState } from 'react';
import { DateTimePicker } from '../date-picker/date-picker';

interface FormDatePickerProps {
  name: string;
  label: string;
  customError?: string;
  control?: Control<any>;
  required?: boolean;
}

export const FormDatePicker = ({
  name,
  label,
  customError,
  control: controlProp,
  required = false
}: FormDatePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const formContext = useFormContext();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormDatePicker must be used within a FormProvider or with a control prop'
    );
    return null;
  }

  const errors = formContext?.formState?.errors || {};
  const inputError = errors[name];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const error = formContext?.formState?.errors[name];
        const showError = error;

        return (
          <FormItem className="w-full">
            <FormLabel
              className={cn(
                'text-paragraph-sm font-medium text-neutral-dark-600',
                required && 'after:ml-1 after:content-["*"]'
              )}
            >
              {label}
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                <DateTimePicker
                  className={cn(
                    'h-[103px] max-h-[103px] w-full bg-neutral-light-100',
                    showError && 'border-error-500 focus-visible:ring-error-100'
                  )}
                  value={date}
                  onChange={setDate}
                  hideTime
                />
              </div>
            </FormControl>
            {showError && (
              <div className="flex items-center gap-2 text-error-500">
                <Icons.informationCircle className="h-4 w-4" />
                <p className="text-paragraph-sm">{customError}</p>
              </div>
            )}
          </FormItem>
        );
      }}
    />
  );
};
