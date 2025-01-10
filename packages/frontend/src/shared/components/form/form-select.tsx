import { Icons } from '@/features/auth/components/icons';
import { cn } from '@/shared/lib/utils';
import { FieldValues, useFormContext, Control, Path } from 'react-hook-form';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/shared/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder: string;
  customError?: string;
  control?: Control<T>;
  required?: boolean;
  options: ReadonlyArray<{
    readonly label: string;
    readonly value: string | number;
  }>;
  transform?: (value: string) => number;
}

export const FormSelect = <T extends FieldValues>({
  name,
  label,
  placeholder,
  customError,
  control: controlProp,
  required = false,
  options
}: FormSelectProps<T>) => {
  const formContext = useFormContext<T>();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormSelect must be used within a FormProvider or with a control prop'
    );
    return null;
  }

  const errors = formContext?.formState?.errors || {};
  const showError = errors[name];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={cn(
              'text-paragraph-sm font-medium text-neutral-dark-600',
              required && 'after:ml-1 after:content-["*"]'
            )}
          >
            {label}
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value?.toString()}
            >
              <SelectTrigger className="w-full bg-neutral-light-100">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {showError && (
            <div className="flex items-center gap-2">
              <Icons.informationCircle className="h-4 w-4 text-error-500" />
              <p className="text-paragraph-sm text-error-500">
                {(errors[name] as { message: string })?.message || customError}
              </p>
            </div>
          )}
        </FormItem>
      )}
    />
  );
};
