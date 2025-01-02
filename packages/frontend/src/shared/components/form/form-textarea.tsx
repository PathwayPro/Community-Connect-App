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
import { Textarea } from '../ui/textarea';
import { SharedIcons } from '../icons';

interface FormTextareaProps {
  name: string;
  label: string;
  placeholder: string;
  customError?: string;
  control?: Control<any>;
  required?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export const FormTextarea = ({
  name,
  label,
  placeholder,
  customError,
  control: controlProp,
  required = false,
  maxLength = 400,
  showCount = true
}: FormTextareaProps) => {
  const formContext = useFormContext();
  const control = controlProp || formContext?.control;

  if (!control) {
    console.error(
      'Form control is missing - FormTextarea must be used within a FormProvider or with a control prop'
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
        const charCount = field.value?.length || 0;
        const isOverLimit = charCount > maxLength;
        const error = formContext?.formState?.errors[name];
        const showError = error || (isOverLimit && field.value);

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
                <Textarea
                  className={cn(
                    'h-[103px] max-h-[103px] w-full bg-neutral-light-100',
                    showError && 'border-error-500 focus-visible:ring-error-100'
                  )}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= maxLength) {
                      field.onChange(e);
                    }
                  }}
                />
                {showCount && (
                  <div className="flex items-center justify-end gap-2 text-neutral-dark-400">
                    <SharedIcons.info className="h-4 w-4" />
                    <p className="text-paragraph-xs">
                      {charCount}/{maxLength} characters
                    </p>
                  </div>
                )}
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
