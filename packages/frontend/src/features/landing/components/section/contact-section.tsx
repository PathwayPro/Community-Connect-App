'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';
import { useSupportStore } from '@/features/support/store';
import { toast } from 'sonner';

const formSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  contact_message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormValues = z.infer<typeof formSchema>;

export function ContactSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { submitContactForm } = useSupportStore();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      contact_message: ''
    }
  });

  const isFieldValid = (fieldName: keyof ContactFormValues) => {
    const field = form.getFieldState(fieldName);
    return field.isDirty && !field.error;
  };

  async function onSubmit(values: ContactFormValues) {
    try {
      await submitContactForm(values);
      setIsSubmitted(true);
      form.reset();
      console.log(values);

      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(
        'Failed to send message, please try again or contact us via email'
      );
    }
  }

  return (
    <section
      id="contact"
      className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 py-12 sm:py-16 lg:py-24"
    >
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-16">
        <div className="mb-16 text-center">
          <h6 className="mb-2 font-semibold text-neutral-dark-100">
            Have Questions? We&apos;re Here to Help
          </h6>
          <h1 className="text-3xl font-semibold text-primary-500 sm:text-4xl md:text-5xl">
            Get In Touch
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="First Name"
                        className={`h-12 w-full rounded-xl border-[0.5px] border-[#C3D0FF] shadow-[0_4px_20px_0px_rgba(0,0,0,0.08)] ring-8 focus-visible:ring-offset-0 sm:h-[60px] ${
                          isFieldValid('first_name')
                            ? 'bg-[#E9EEFF] ring-[#E9EEFF]'
                            : 'bg-neutral-light-200 ring-neutral-light-200'
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Last Name"
                        className={`h-12 w-full rounded-xl border-[#C3D0FF] shadow-[0_4px_20px_0px_rgba(0,0,0,0.08)] ring-8 focus-visible:ring-offset-0 sm:h-[60px] ${
                          isFieldValid('last_name')
                            ? 'bg-[#E9EEFF] ring-[#E9EEFF]'
                            : 'bg-neutral-light-200 ring-neutral-light-200'
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Email"
                      className={`h-12 w-full rounded-xl border-[#C3D0FF] shadow-[0_4px_20px_0px_rgba(0,0,0,0.08)] ring-8 focus-visible:ring-offset-0 sm:h-[60px] ${
                        isFieldValid('email')
                          ? 'bg-[#E9EEFF] ring-[#E9EEFF]'
                          : 'bg-neutral-light-200 ring-neutral-light-200'
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Write your questions and messages here..."
                      className={`h-40 w-full rounded-xl border-[#C3D0FF] text-base shadow-[0_4px_20px_0px_rgba(0,0,0,0.08)] ring-8 focus-visible:ring-offset-0 sm:h-[204px] sm:text-xl ${
                        isFieldValid('contact_message')
                          ? 'bg-[#E9EEFF] ring-[#E9EEFF]'
                          : 'bg-neutral-light-200 ring-neutral-light-200'
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className={cn(
                'h-12 w-full sm:h-[60px]',
                isSubmitted && 'bg-success-500 text-white'
              )}
              disabled={
                isSubmitted ||
                !isFieldValid('first_name') ||
                !isFieldValid('last_name') ||
                !isFieldValid('email') ||
                !isFieldValid('contact_message')
              }
            >
              {isSubmitted ? 'Message Sent!' : 'Send Message'}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
