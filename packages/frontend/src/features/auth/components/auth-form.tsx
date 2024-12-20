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
import { Input } from '@/shared/components/ui/input';
import { Icons } from '@/features/auth/components/icons';
import { useAuth } from '@/features/auth/hooks/use-auth';
import {
  LoginFormValues,
  RegisterFormValues,
  loginSchema,
  registerSchema
} from '@/features/auth/validations/auth.schema';
import Link from 'next/link';
import { IconInput } from '@/shared/components/ui/icon-input';
import { cn } from '@/shared/lib/utils';

type AuthFormValues = LoginFormValues & {
  firstName?: string;
  lastName?: string;
  passwordHash?: string;
  confirmPassword?: string;
};

export function AuthForm() {
  const pathname = usePathname();
  const { login, register, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isRegisterPage = pathname === '/auth/register';

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(isRegisterPage ? registerSchema : loginSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(isRegisterPage && {
        firstName: '',
        lastName: '',
        passwordHash: '',
        confirmPassword: ''
      })
    }
  });

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);

    console.log('auth data :', data);

    try {
      if (isRegisterPage) {
        await register(data as RegisterFormValues);
      } else {
        console.log('login data :', data);
        await login(data as LoginFormValues);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    console.log('google sign in');

    try {
      // Handle Google sign-in
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-900">
      <Icons.logo className="mx-auto h-[84px] w-[84px]" />
      <div className="space-y-2 text-center">
        <h2>{isRegisterPage ? 'Create an account' : 'Welcome back'}</h2>
        <p className="text-sm text-muted-foreground">
          {isRegisterPage
            ? 'Enter your details to create your account'
            : 'Enter your credentials to sign in'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isRegisterPage && (
            <div className="flex flex-row items-end justify-between gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-paragraph-sm font-medium text-neutral-dark-600">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={cn(
                          'w-full',
                          form.formState.errors.firstName &&
                            'border-red-500 focus-visible:ring-red-100'
                        )}
                        placeholder="First Name"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.firstName && (
                      <div className="flex flex-row items-center gap-2">
                        <Icons.informationCircle className="h-4 w-4" />
                        <p className="text-paragraph-sm text-error-500">
                          First name is required
                        </p>
                      </div>
                    )}
                    {!form.formState.errors.firstName &&
                      form.formState.errors.lastName && (
                        <div className="flex h-6 flex-row items-center gap-2"></div>
                      )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-paragraph-sm font-medium text-neutral-dark-600">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={cn(
                          'w-full',
                          form.formState.errors.lastName &&
                            'border-red-500 focus-visible:ring-red-100'
                        )}
                        placeholder="Last Name"
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors.lastName && (
                      <div className="flex flex-row items-center gap-2">
                        <Icons.informationCircle className="h-4 w-4" />
                        <p className="text-paragraph-sm text-error-500">
                          Last name is required
                        </p>
                      </div>
                    )}
                    {form.formState.errors.firstName &&
                      !form.formState.errors.lastName && (
                        <div className="flex h-6 flex-row items-center gap-2"></div>
                      )}
                  </FormItem>
                )}
              />
            </div>
          )}

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

          <FormField
            control={form.control}
            name={isRegisterPage ? 'passwordHash' : 'password'}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-paragraph-sm font-medium text-neutral-dark-600">
                  Password
                </FormLabel>
                <FormControl>
                  <IconInput
                    placeholder="Create your password"
                    type={showPassword ? 'text' : 'password'}
                    leftIcon="lock"
                    rightIcon={showPassword ? 'eyeSlash' : 'eye'}
                    setState={setShowPassword}
                    state={showPassword}
                    className={cn(
                      'w-full',
                      form.formState.errors.password &&
                        'border-red-500 focus-visible:ring-red-100'
                    )}
                    {...field}
                  />
                </FormControl>
                {!isRegisterPage && form.formState.errors.password && (
                  <div className="flex flex-row items-center gap-2">
                    <Icons.informationCircle className="h-4 w-4" />
                    <p className="text-paragraph-sm text-error-500">
                      Password is required to sign in
                    </p>
                  </div>
                )}

                {isRegisterPage && form.formState.errors.passwordHash && (
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

          {isRegisterPage && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-paragraph-sm font-medium text-neutral-dark-600">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <IconInput
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      leftIcon="lock"
                      rightIcon={showConfirmPassword ? 'eyeSlash' : 'eye'}
                      setState={setShowConfirmPassword}
                      state={showConfirmPassword}
                      className={cn(
                        'w-full',
                        form.formState.errors.passwordHash &&
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

          {!isRegisterPage && (
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm">
                Forgot your password?{' '}
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-secondary-400 hover:underline"
                >
                  Click here
                </Link>
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isRegisterPage ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-neutral-dark-500">
        {isRegisterPage ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Link
          href={isRegisterPage ? '/auth/login' : '/auth/register'}
          className="text-sm font-medium text-secondary-400 hover:underline"
        >
          {isRegisterPage ? 'Sign In' : 'Sign Up'}
        </Link>
      </p>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full bg-neutral-dark-800 text-white"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Login with Google
      </Button>

      {isRegisterPage && (
        <p className="text-center text-sm text-neutral-dark-500">
          {'By signing up, you agree to our'}{' '}
          <Link
            href="/terms-of-service"
            className="text-sm font-medium text-secondary-400 hover:underline"
          >
            Terms of Service{' '}
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy-policy"
            className="text-sm font-medium text-secondary-400 hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
      )}
    </div>
  );
}
