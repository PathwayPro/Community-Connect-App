'use client';

import { FormInput, FormTextarea } from '@/shared/components/form';
import { FormProvider, useForm } from 'react-hook-form';
import { IconButton } from '@/shared/components/ui/icon-button';
import { FormPhonebook } from '@/shared/components/form/form-phonebook';
import { useSupport } from '@/features/support/hooks/use-support';
import { ContactUsDto } from '@/features/support/dto';
import { contactFormSchema } from '@/features/support/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';

export const SupportForm = () => {
  const { submitContactForm } = useSupport();
  const { showAlert } = useAlertDialog();

  const form = useForm<ContactUsDto>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      company_name: '',
      email: '',
      phone: '',
      contact_message: ''
    }
  });

  const onSubmit = async (values: ContactUsDto) => {
    try {
      await submitContactForm(values);
      form.reset();
      showAlert({
        title: 'Success',
        description: 'Your message has been sent successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      showAlert({
        title: 'Error',
        description: 'Failed to submit contact form',
        type: 'error'
      });
    }
  };

  console.log('form.formState.errors', form.formState.errors);

  return (
    <FormProvider {...form}>
      <AlertDialogUI />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="first_name"
            label="First Name"
            placeholder="Enter your first name"
            customError={form.formState.errors.first_name?.message}
            required
          />
          <FormInput
            name="last_name"
            label="Last Name"
            placeholder="Enter your last name"
          />
        </div>

        <FormInput
          name="company_name"
          label="Company"
          placeholder="Enter your company name"
          customError={form.formState.errors.company_name?.message}
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

        <FormPhonebook
          name="phone"
          label="Phone"
          placeholder="Enter your phone number"
          customError={form.formState.errors.phone?.message}
        />

        <FormTextarea
          name="contact_message"
          label="Message"
          placeholder="Enter your message"
          required
          maxLength={1000}
          customError={form.formState.errors.contact_message?.message}
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
