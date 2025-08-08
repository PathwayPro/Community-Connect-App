'use client';

import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useToast } from '@/shared/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/shared/components/ui/form';
import { cn } from '@/shared/lib/utils';
import { SharedIcons } from '@/shared/components/icons';
import { useSupportStore } from '@/features/support/store';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type FormValues = z.infer<typeof formSchema>;

export function NewsletterSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { subscribeToNewsletter, error, isSuccess, clearError } =
    useSupportStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (values: FormValues) => {
    clearError();
    await subscribeToNewsletter({ email: values.email });

    if (isSuccess) {
      setIsSubmitted(true);

      toast({
        title: 'Success!',
        description: "You've been subscribed to Communet's newsletter."
      });

      setTimeout(() => {
        setIsSubmitted(false);
        form.reset();
      }, 3000);
    } else if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error || 'Failed to subscribe to the newsletter'
      });
    }
  };

  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-screen-xl px-4">
        <div className="space-y-4 text-center">
          <h6 className="mb-2 font-semibold text-neutral-dark-100">
            BE IN THE KNOW
          </h6>
          <h1 className="text-3xl font-semibold text-primary-500 sm:text-4xl md:text-5xl">
            Subscribe to our Newsletter
          </h1>
          <p className="paragraph-lg text-neutral-dark-100">
            Stay up to date with our latest news and updates
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto mt-8 w-full max-w-3xl"
          >
            <div className="relative flex w-full flex-col gap-3 sm:flex-row sm:gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="johndoe@email.com"
                          className={cn(
                            'h-12 w-full rounded-xl border-[#C3D0FF] shadow-[0_4px_20px_0px_rgba(0,0,0,0.08)] sm:h-[60px]',
                            isSubmitted && 'pl-10',
                            form.formState.isValid
                              ? 'bg-[#E9EEFF] ring-8 ring-[#E9EEFF]'
                              : 'bg-neutral-light-200 ring-8 ring-neutral-light-200'
                          )}
                          type="email"
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                        {isSubmitted && (
                          <SharedIcons.check className="absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex sm:absolute sm:right-0">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || isSubmitted}
                  className={cn(
                    'h-12 w-full rounded-xl bg-primary-500 px-8 text-white sm:h-[60px] sm:w-fit sm:px-12'
                  )}
                >
                  {isSubmitted ? 'Subscribed!' : 'Subscribe'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
