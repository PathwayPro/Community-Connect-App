'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/shared/components/ui/form';
import { Icons } from '@/features/auth/components/icons';
import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  forgotPasswordSchema,
  resetPasswordWithTokenSchema, // Change this import
  ForgotPasswordFormValues,
  ResetPasswordWithTokenFormValues // Change this import
} from '@/features/auth/validations/auth.schema';
import Link from 'next/link';
import { IconInput } from '@/shared/components/ui/icon-input';
import { cn } from '@/shared/lib/utils';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { useSearchParams } from 'next/navigation';

type RetrievePasswordFormValues = ForgotPasswordFormValues &
  ResetPasswordWithTokenFormValues;

export function ForgotPasswordForm() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { forgotPassword, resetPassword, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isForgotPasswordPage = pathname === '/auth/forgot-password';

  // Move useForm hook before any conditional returns
  const form = useForm<RetrievePasswordFormValues>({
    resolver: zodResolver(
      isForgotPasswordPage ? forgotPasswordSchema : resetPasswordWithTokenSchema
    ),
    defaultValues: {
      email: '',
      ...(isForgotPasswordPage ? {} : { newPassword: '', confirmPassword: '' })
    }
  });

  // Add token validation AFTER the hook
  if (!isForgotPasswordPage && !token) {
    return (
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900">
        <div className="space-y-2 text-center">
          <h2>Invalid Reset Link</h2>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/auth/forgot-password" className="text-primary">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  // Add this after the form definition to debug validation errors
  console.log('Form errors:', form.formState.errors);
  console.log('Form is valid:', form.formState.isValid);

  const onSubmit = async (data: RetrievePasswordFormValues) => {
    console.log('Form submitted with data:', data);
    console.log('isForgotPasswordPage:', isForgotPasswordPage);
    console.log('token:', token);

    if (isForgotPasswordPage) {
      await forgotPassword(data as ForgotPasswordFormValues);
    } else {
      // Include token in reset password call
      await resetPassword({
        ...(data as ResetPasswordWithTokenFormValues),
        token: token || ''
      });
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900">
      <AlertDialogUI />
      <Icons.logo className="mx-auto h-[84px] w-[84px]" />
      <div className="space-y-2 text-center">
        {isForgotPasswordPage ? (
          <h2>Forgot Password</h2>
        ) : (
          <h2>Reset Password</h2>
        )}
        <p className="text-sm text-muted-foreground">
          {isForgotPasswordPage
            ? 'Enter your email to get reset password link'
            : 'Enter your new password'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isForgotPasswordPage && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-paragraph-sm font-medium text-neutral-dark-600">
                    Email
                  </FormLabel>
                  <FormControl>
                    <IconInput
                      placeholder="Enter your email"
                      leftIcon="mail"
                      rightIcon="circleHelp"
                      className={cn(
                        'w-full',
                        form.formState.errors.email &&
                          'border-red-500 focus-visible:ring-red-100'
                      )}
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.email && (
                    <div className="flex flex-row items-center gap-2">
                      <Icons.informationCircle className="h-4 w-4" />
                      <p className="text-paragraph-sm text-error-500">
                        Invalid email address
                      </p>
                    </div>
                  )}
                </FormItem>
              )}
            />
          )}
          {!isForgotPasswordPage && (
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-paragraph-sm font-medium text-neutral-dark-600">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <IconInput
                      placeholder="Create your new password"
                      type={showPassword ? 'text' : 'password'}
                      leftIcon="lock"
                      rightIcon={showPassword ? 'eyeSlash' : 'eye'}
                      setState={setShowPassword}
                      state={showPassword}
                      className={cn(
                        'w-full',
                        form.formState.errors.newPassword &&
                          'border-red-500 focus-visible:ring-red-100'
                      )}
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.newPassword && (
                    <>
                      <div className="flex flex-row items-center gap-2">
                        <Icons.informationCircle className="h-4 w-4" />
                        <p className="text-paragraph-sm text-error-500">
                          Password doesn&apos;t meet minimum requirements
                        </p>
                      </div>

                      <div className="grid grid-cols-2">
                        <ul className="ml-6 list-disc">
                          <li className="text-paragraph-sm text-error-500">
                            Minimum 8 characters
                          </li>
                          <li className="text-paragraph-sm text-error-500">
                            One special character
                          </li>
                          <li className="text-paragraph-sm text-error-500">
                            One number
                          </li>
                        </ul>
                        <ul className="ml-6 list-disc">
                          <li className="text-paragraph-sm text-error-500">
                            One uppercase letter
                          </li>
                          <li className="text-paragraph-sm text-error-500">
                            One lowercase letter
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </FormItem>
              )}
            />
          )}

          {!isForgotPasswordPage && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-paragraph-sm font-medium text-neutral-dark-600">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <IconInput
                      placeholder="Confirm your new password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      leftIcon="lock"
                      rightIcon={showConfirmPassword ? 'eyeSlash' : 'eye'}
                      setState={setShowConfirmPassword}
                      state={showConfirmPassword}
                      className={cn(
                        'w-full',
                        form.formState.errors.newPassword &&
                          'border-red-500 focus-visible:ring-red-100'
                      )}
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.confirmPassword && (
                    <div className="flex flex-row items-center gap-2">
                      <Icons.informationCircle className="h-4 w-4" />
                      <p className="text-paragraph-sm text-error-500">
                        Passwords don&apos;t match
                      </p>
                    </div>
                  )}
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isForgotPasswordPage ? 'Send Email' : 'Reset Password'}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-neutral-dark-500">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="text-sm font-medium text-secondary-400 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
