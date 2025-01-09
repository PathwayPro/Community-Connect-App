import { Icons } from '@/features/auth/components/icons';
import { cn } from '@/shared/lib/utils';
import { FieldValues, useFormContext, Control, Path } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/shared/components/ui/form';
import { DateTimePicker } from '../date-picker/date-picker';

interface FormDatePickerProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  customError?: string;
  control?: Control<T>;
  required?: boolean;
}

export const FormDatePicker = <T extends FieldValues>({
  name,
  label,
  customError,
  control: controlProp,
  required = false
}: FormDatePickerProps<T>) => {
  const formContext = useFormContext<T>();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormDatePicker must be used within a FormProvider or with a control prop'
    );
    return null;
  }

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
                  value={field.value}
                  onChange={field.onChange}
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
