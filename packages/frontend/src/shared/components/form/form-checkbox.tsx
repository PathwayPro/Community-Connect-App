import { Icons } from '@/features/auth/components/icons';
import { cn } from '@/shared/lib/utils';
import { FieldValues, useFormContext, Control, Path } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/shared/components/ui/form';
import { Checkbox } from '@/shared/components/ui/checkbox';

interface CheckboxOption {
  id: string;
  label: string;
  value: string;
}

interface FormCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: CheckboxOption[];
  control?: Control<T>;
  required?: boolean;
  disabled?: boolean;
  customError?: string;
}

export const FormCheckbox = <T extends FieldValues>({
  name,
  label,
  options,
  control: controlProp,
  required = false,
  disabled = false,
  customError
}: FormCheckboxProps<T>) => {
  const formContext = useFormContext<T>();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormCheckbox must be used within a FormProvider or with a control prop'
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
            <div className="flex flex-col gap-3">
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={field.value?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const values = field.value || [];
                      if (checked) {
                        field.onChange([...values, option.value]);
                      } else {
                        field.onChange(
                          values.filter(
                            (value: string) => value !== option.value
                          )
                        );
                      }
                    }}
                    disabled={disabled}
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
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
