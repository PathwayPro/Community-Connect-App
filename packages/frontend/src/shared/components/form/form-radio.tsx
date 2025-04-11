import { Icons } from '@/features/auth/components/icons';
import { cn } from '@/shared/lib/utils';
import { FieldValues, useFormContext, Control, Path } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/shared/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';

interface RadioOption {
  id: string;
  label: string;
  value: string;
}

interface FormRadioProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: RadioOption[];
  control?: Control<T>;
  required?: boolean;
  disabled?: boolean;
  customError?: string;
}

export const FormRadio = <T extends FieldValues>({
  name,
  label,
  options,
  control: controlProp,
  required = false,
  disabled = false,
  customError
}: FormRadioProps<T>) => {
  const formContext = useFormContext<T>();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormRadio must be used within a FormProvider or with a control prop'
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
            <RadioGroup
              disabled={disabled}
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-col gap-3"
            >
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.id} />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
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
