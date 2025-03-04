'use client';

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

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormValues = z.infer<typeof formSchema>;

export function ContactSection() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      message: ''
    }
  });

  const isFieldValid = (fieldName: keyof ContactFormValues) => {
    const field = form.getFieldState(fieldName);
    return field.isDirty && !field.error;
  };

  async function onSubmit(values: ContactFormValues) {
    // TODO: Implement your form submission logic here
    console.log(values);
  }

  return (
    <div className="mx-auto w-full px-16 pb-[160px]">
      <div className="mb-16 text-center">
        <h6 className="mb-2 font-semibold text-neutral-dark-100">
          Have Questions? We&apos;re Here to Help
        </h6>
        <h1 className="text-5xl font-semibold text-primary-500">
          Get In Touch
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="First Name"
                      className={`h-[60px] w-full rounded-xl border-[0.5px] border-[#C3D0FF] shadow-[0_4px_20px_0px_rgba(0,0,0,0.08)] ring-8 focus-visible:ring-offset-0 ${
                        isFieldValid('firstName')
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Last Name"
                      className={`h-[60px] w-full rounded-xl border-[#C3D0FF] shadow-[0_4px_20px_0px_rgba(0,0,0,0.08)] ring-8 focus-visible:ring-offset-0 ${
                        isFieldValid('lastName')
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
                    className={`h-[60px] w-full rounded-xl border-[#C3D0FF] shadow-[0_4px_20px_0px_rgba(0,0,0,0.08)] ring-8 focus-visible:ring-offset-0 ${
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
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write your questions and messages here..."
                    className={`h-[204px] w-full rounded-xl border-[#C3D0FF] text-xl shadow-[0_4px_20px_0px_rgba(0,0,0,0.08)] ring-8 focus-visible:ring-offset-0 ${
                      isFieldValid('message')
                        ? 'bg-[#E9EEFF] ring-[#E9EEFF]'
                        : 'bg-neutral-light-200 ring-neutral-light-200'
                    }`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="h-[60px] w-full">
            Send Message
          </Button>
        </form>
      </Form>
    </div>
  );
}
