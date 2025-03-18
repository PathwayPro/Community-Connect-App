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
import { PhoneInput } from '@/shared/components/ui/phone-input';

interface FormPhonebookProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  customError?: string;
  control?: Control<T>;
  required?: boolean;
}

export const FormPhonebook = <T extends FieldValues>({
  name,
  label,
  customError,
  control: controlProp,
  required = false
}: FormPhonebookProps<T>) => {
  const formContext = useFormContext<T>();
  const control = controlProp || formContext?.control;

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
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                international
                defaultCountry="CA"
              />
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
