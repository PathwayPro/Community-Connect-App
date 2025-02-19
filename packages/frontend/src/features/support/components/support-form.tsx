'use client';

import { FormInput, FormTextarea } from '@/shared/components/form';
import { FormProvider, useForm } from 'react-hook-form';
import { IconButton } from '@/shared/components/ui/icon-button';
import { FormPhonebook } from '@/shared/components/form/form-phonebook';
import { useSupport } from '@/features/support/hooks/use-support';
import { ContactFormData } from '@/features/support/types';
import { contactFormSchema } from '@/features/support/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';

export const SupportForm = () => {
  const { submitContactForm } = useSupport();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      email: '',
      phone: '',
      message: ''
    }
  });

  const onSubmit = (values: ContactFormData) => {
    submitContactForm(values);
  };

  return (
    <FormProvider {...form}>
      <AlertDialogUI />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="firstName"
            label="First Name"
            placeholder="Enter your first name"
            customError={form.formState.errors.firstName?.message}
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
          customError={form.formState.errors.companyName?.message}
          required
        />

        <FormInput
          hasInputIcon
          leftIcon="mail"
          name="email"
          label="Email"
          placeholder="Enter your email"
          required
          customError={form.formState.errors.email?.message}
        />

        <FormPhonebook name="phone" label="Phone" />

        <FormTextarea
          name="message"
          label="Message"
          placeholder="Enter your message"
          required
          maxLength={1000}
          customError={form.formState.errors.message?.message}
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
