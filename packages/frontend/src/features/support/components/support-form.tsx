'use client';

import { FormInput, FormTextarea } from '@/shared/components/form';
import { FormProvider, useForm } from 'react-hook-form';
import { IconButton } from '@/shared/components/ui/icon-button';
import { FormPhonebook } from '@/shared/components/form/form-phonebook';

interface SupportFormValues {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

export const SupportForm = () => {
  const form = useForm<SupportFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  const onSubmit = (values: SupportFormValues) => {
    // Handle form submission
    console.log(values);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="firstName"
            label="First Name"
            placeholder="Enter your first name"
            required
          />
          <FormInput
            name="lastName"
            label="Last Name"
            placeholder="Enter your last name"
          />
        </div>

        <FormInput
          name="company"
          label="Company"
          placeholder="Enter your company name"
        />

        <FormInput
          hasInputIcon
          leftIcon="mail"
          name="email"
          label="Email"
          placeholder="Enter your email"
          required
        />

        <FormPhonebook name="phone" label="Phone" />

        <FormTextarea
          name="message"
          label="Message"
          placeholder="Enter your message"
          required
          maxLength={1000}
        />

        <IconButton
          rightIcon="send"
          type="submit"
          className="w-full"
          label="Send"
        />
      </form>
    </FormProvider>
  );
};
