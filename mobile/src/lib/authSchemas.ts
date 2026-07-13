import { z } from 'zod';
import i18n from '../i18n';

export function getSignInSchema() {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, i18n.t('auth.emailRequired'))
      .email(i18n.t('auth.emailInvalid')),
    password: z.string().min(8, i18n.t('auth.passwordMin')),
  });
}

export function getSignUpSchema() {
  return getSignInSchema()
    .extend({
      name: z
        .string()
        .trim()
        .min(2, i18n.t('auth.nameMin'))
        .max(80, i18n.t('auth.nameMax')),
      confirmPassword: z.string().min(8, i18n.t('auth.confirmRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: i18n.t('auth.passwordsMismatch'),
      path: ['confirmPassword'],
    });
}

/** @deprecated Prefer getSignInSchema() */
export const signInSchema = getSignInSchema();

/** @deprecated Prefer getSignUpSchema() */
export const signUpSchema = getSignUpSchema();

export type SignInInput = z.infer<ReturnType<typeof getSignInSchema>>;
export type SignUpInput = z.infer<ReturnType<typeof getSignUpSchema>>;

export function formatZodError(error: z.ZodError): string {
  return error.issues.map((issue) => issue.message).join(', ');
}

export function fieldErrorsFromZod(
  error: z.ZodError,
): Partial<Record<keyof SignUpInput, string>> {
  const fieldErrors: Partial<Record<keyof SignUpInput, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in fieldErrors)) {
      fieldErrors[key as keyof SignUpInput] = issue.message;
    }
  }
  return fieldErrors;
}
