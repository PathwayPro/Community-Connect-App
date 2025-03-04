'use client';

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

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type FormValues = z.infer<typeof formSchema>;

export function NewsletterSection() {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // TODO: Implement your newsletter subscription API call here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call

      toast({
        title: 'Success!',
        description: "You've been subscribed to our newsletter."
      });

      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again later.'
      });
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16">
      <div className="space-y-4 text-center">
        <h6 className="mb-2 font-semibold text-neutral-dark-100">
          BE IN THE KNOW
        </h6>
        <h1 className="text-5xl font-semibold text-primary-500">
          Subscribe to our Newsletter
        </h1>
        <p className="paragraph-lg text-neutral-dark-100">
          Stay up to date with our latest news and updates
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-8 flex gap-2"
        >
          <div className="relative flex w-full items-center">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="johndoe@email.com"
                      className={`h-[60px] w-full rounded-xl border-[#C3D0FF] shadow-[0_4px_20px_0px_rgba(0,0,0,0.08)] ${
                        form.formState.isValid
                          ? 'bg-[#E9EEFF] ring-8 ring-[#E9EEFF]'
                          : 'bg-neutral-light-200 ring-8 ring-neutral-light-200'
                      }`}
                      type="email"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="absolute right-0 flex items-center">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-[60px] w-fit rounded-xl bg-primary-500 px-12 text-white"
              >
                {form.formState.isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
