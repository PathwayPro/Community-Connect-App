import { Icons } from '@/features/auth/components/icons';
import { cn } from '@/shared/lib/utils';
import { useFormContext } from 'react-hook-form';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/shared/components/ui/form';
import { Control } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/components/ui/select';

interface FormSelectProps {
  name: string;
  label: string;
  placeholder: string;
  customError?: string;
  control?: Control<any>;
  required?: boolean;
  options: {
    label: string;
    value: string;
  }[];
}

export const FormSelect = ({
  name,
  label,
  placeholder,
  customError,
  control: controlProp,
  required = false,
  options
}: FormSelectProps) => {
  const formContext = useFormContext();
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full bg-neutral-light-100">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {showError && (
            <div className="flex items-center gap-2 text-error-500">
              <Icons.informationCircle className="h-4 w-4" />
              <p className="text-paragraph-sm">{customError}</p>
            </div>
          )}
        </FormItem>
      )}
    />
  );
};
