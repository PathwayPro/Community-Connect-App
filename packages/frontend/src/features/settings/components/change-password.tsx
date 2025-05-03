'use client';

import { useEffect, useState } from 'react';
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
import { IconInput } from '@/shared/components/ui/icon-input';
import { cn } from '@/shared/lib/utils';
import { AlertDialogUI } from '@/shared/components/notification/alert-dialog';
import { useAlertDialog } from '@/shared/hooks/use-alert-dialog';
import { z } from 'zod';
import { useUserStore } from '@/features/user-profile/store';
// New schema for change password
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string()
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const passwordRequirements = [
  { text: 'Minimum 8 characters' },
  { text: 'One special character' },
  { text: 'One number' },
  { text: 'One uppercase letter' },
  { text: 'One lowercase letter' }
];

export function ChangePasswordForm() {
  const { resetPassword, isLoading } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showAlert } = useAlertDialog();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    console.log('data from form to reset password', data);

    try {
      await resetPassword(data);

      form.reset();

      showAlert({
        title: 'Password changed successfully',
        description: 'Your password has been changed successfully',
        type: 'success',
        redirect: '/auth/login'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      showAlert({
        title: 'Error changing password',
        description: 'Your password has not been changed',
        type: 'error'
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      <AlertDialogUI />
      <div className="space-y-2">
        <h6 className="text-paragraph-lg font-semibold text-neutral-dark-600">
          Change Password
        </h6>
        <p className="text-paragraph-sm text-neutral-dark-600">
          Update your password to keep your account secure
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-paragraph-sm font-medium text-neutral-dark-600">
                  Current Password
                </FormLabel>
                <FormControl>
                  <IconInput
                    placeholder="Enter your current password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    leftIcon="lock"
                    rightIcon={showCurrentPassword ? 'eyeSlash' : 'eye'}
                    setState={setShowCurrentPassword}
                    state={showCurrentPassword}
                    className={cn(
                      'w-full',
                      form.formState.errors.currentPassword &&
                        'border-red-500 focus-visible:ring-red-100'
                    )}
                    {...field}
                  />
                </FormControl>
                {form.formState.errors.currentPassword && (
                  <div className="flex flex-row items-center gap-2">
                    <Icons.informationCircle className="h-4 w-4" />
                    <p className="text-paragraph-sm text-error-500">
                      {form.formState.errors.currentPassword.message}
                    </p>
                  </div>
                )}
              </FormItem>
            )}
          />

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
                    type={showNewPassword ? 'text' : 'password'}
                    leftIcon="lock"
                    rightIcon={showNewPassword ? 'eyeSlash' : 'eye'}
                    setState={setShowNewPassword}
                    state={showNewPassword}
                    className={cn(
                      'w-full',
                      form.formState.errors.newPassword &&
                        'border-red-500 focus-visible:ring-red-100'
                    )}
                    {...field}
                  />
                </FormControl>
                {form.formState.errors.newPassword ? (
                  <>
                    <div className="flex flex-row items-center gap-2">
                      <Icons.informationCircle className="h-4 w-4" />
                      <p className="text-paragraph-sm text-error-500">
                        Password doesn&apos;t meet minimum requirements
                      </p>
                    </div>

                    <div className="grid grid-cols-2">
                      {passwordRequirements.map((req, index) => (
                        <li
                          key={index}
                          className="ml-6 list-disc text-paragraph-sm text-error-500"
                        >
                          {req.text}
                        </li>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-row items-center gap-2">
                      <Icons.info className="h-4 w-4 text-primary-500" />
                      <p className="text-paragraph-sm text-primary-500">
                        Password minimum requirements
                      </p>
                    </div>

                    <div className="grid grid-cols-2">
                      {passwordRequirements.map((req, index) => (
                        <li
                          key={index}
                          className="ml-6 list-disc text-paragraph-sm text-primary-500"
                        >
                          {req.text}
                        </li>
                      ))}
                    </div>
                  </>
                )}
              </FormItem>
            )}
          />

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
                      form.formState.errors.confirmPassword &&
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

          <Button type="submit" className="h-10 w-fit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Change Password
          </Button>
        </form>
      </Form>
    </div>
  );
}
