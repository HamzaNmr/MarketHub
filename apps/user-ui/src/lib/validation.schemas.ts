import * as z from 'zod'

export const EmailSchema = z.string().email({ message: 'Invalid email address' })

export const PasswordSchema = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long' })
  .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' })

export const NameSchema = z
  .string()
  .min(2, { message: 'Name must be at least 2 characters long' })

export const PhoneSchema = z
  .string()
  .min(10, { message: 'Phone number must be valid' })

export const MessageSchema = z
  .string()
  .min(10, { message: 'Message must be at least 10 characters long' })

export const LoginFormSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  remember_me: z.boolean(),
})

export const RegisterFormSchema = z
.object({
  name: NameSchema,
  email: EmailSchema,
  // phone: PhoneSchema,
  password: PasswordSchema,
  // confirm_password: z.string(),
})

export const VerifyOtpFormSchema = z
.object({
  otp: z.string().min(4, { message: "OTP is required."})
})

export const ForgotPasswordFormSchema = z.object({
  email: EmailSchema,
})

export const ResetPasswordFormSchema = z.object({
  password: PasswordSchema,
   // confirm_password: z.string(),
})