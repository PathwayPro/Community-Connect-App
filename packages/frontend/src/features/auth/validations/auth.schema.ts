import * as z from 'zod';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First Name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    passwordHash: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(passwordPattern, 'Password must meet minimum requirements'),
    confirmPassword: z.string()
  })
  .refine((data) => data.passwordHash === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const resetPasswordSchema = z
  .object({
    passwordHash: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .refine((data) => data.passwordHash === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
