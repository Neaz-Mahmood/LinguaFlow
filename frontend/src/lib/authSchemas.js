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

/** @deprecated Use getSignInSchema() for localized messages */
export const signInSchema = getSignInSchema();

/** @deprecated Use getSignUpSchema() for localized messages */
export const signUpSchema = getSignUpSchema();

export function formatZodError(error) {
  return error.issues.map((issue) => issue.message).join(', ');
}

/** @returns {Record<string, string>} */
export function fieldErrorsFromZod(error) {
  const fieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
