import { Icons } from '@/features/auth/components/icons';
import { cn } from '@/shared/lib/utils';
import {
  FieldValues,
  useFormContext,
  Control,
  Path,
  FieldError
} from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from '@/shared/components/ui/form';
import { MultiSelect } from '../ui/multi-select';

interface FormMultiSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: { value: number | string; label: string }[];
  placeholder: string;
  customError?: string;
  control?: Control<T>;
  required?: boolean;
  maxCount?: number;
  value?: (number | string)[];
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
  // value
}: FormMultiSelectProps<T>) => {
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

        console.log('error :', error);

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
                  onValueChange={(value: (number | string)[]) =>
                    field.onChange(value)
                  }
                  value={field.value || []}
                  defaultValue={field.value || []}
                  maxCount={maxCount}
                  animation={animation}
                  variant={variant}
                />
              </div>
            </FormControl>
            {showError && (
              <div className="flex items-center gap-2 text-error-500">
                <Icons.informationCircle className="h-4 w-4" />
                <p className="text-paragraph-sm text-error-500">
                  {customError ||
                    (error as FieldError)?.message ||
                    'Invalid type of selection'}
                </p>
              </div>
            )}
          </FormItem>
        );
      }}
    />
  );
};
