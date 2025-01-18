import { Icons } from '@/features/auth/components/icons';
import { cn } from '@/shared/lib/utils';
import { FieldValues, useFormContext, Control, Path } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/shared/components/ui/form';
import { MultiSelect } from '../ui/multi-select';
import { useState } from 'react';

interface FormMultiSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: { value: string; label: string }[];
  placeholder: string;
  customError?: string;
  control?: Control<T>;
  required?: boolean;
  maxCount?: number;
}

export const FormMultiSelect = <T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  customError,
  control: controlProp,
  required = false,
  maxCount = 10
}: FormMultiSelectProps<T>) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const formContext = useFormContext<T>();
  const control = controlProp || formContext?.control;
  const animation = 2;
  const variant = 'default';

  if (!control) {
    console.error(
      'Form control is missing - FormMultiSelect must be used within a FormProvider or with a control prop'
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
                <MultiSelect
                  className={cn(
                    'max-h-[103px] min-h-12 w-full rounded-xl bg-neutral-light-100',
                    showError && 'border-error-500 focus-visible:ring-error-100'
                  )}
                  options={options}
                  placeholder={placeholder}
                  onValueChange={setSelectedValues}
                  defaultValue={selectedValues}
                  maxCount={maxCount}
                  animation={animation}
                  variant={variant}
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
