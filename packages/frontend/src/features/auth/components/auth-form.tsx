'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
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

type AuthFormValues = LoginFormValues | RegisterFormValues;

export function AuthForm() {
  const pathname = usePathname();
  const router = useRouter();
  const { login, register, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isRegisterPage = pathname === '/register';

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(isRegisterPage ? registerSchema : loginSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(isRegisterPage && { name: '' })
    }
  });

  const onSubmit = async (data: AuthFormValues) => {
    setIsLoading(true);

    console.log('auth data :', data);

    try {
      if (isRegisterPage) {
        await register(data as RegisterFormValues);
      } else {
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
    <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">
          {isRegisterPage ? 'Create an account' : 'Welcome back'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isRegisterPage
            ? 'Enter your details to create your account'
            : 'Enter your credentials to sign in'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isRegisterPage && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@email.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isRegisterPage ? 'Create account' : 'Sign in'}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        type="button"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isRegisterPage ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Button
          variant="link"
          className="p-0 font-medium"
          onClick={() => router.push(isRegisterPage ? '/login' : '/register')}
        >
          {isRegisterPage ? 'Sign in' : 'Create account'}
        </Button>
      </p>
    </div>
  );
}
