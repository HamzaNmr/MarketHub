'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shadcn/components/form'
import { Button } from '@shadcn/components/button'
import { Input } from '@shadcn/components/input'
import AuthForm from './auth-form'
import { ForgotPasswordFormSchema } from '../../lib/validation.schemas'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { LoaderIcon } from 'lucide-react'
import { useResendTimer } from 'src/hooks/use-resend-timer'

export default function ForgotPasswordForm() {
  const router = useRouter()
  const { start } = useResendTimer(60)

  const form = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof ForgotPasswordFormSchema>) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
        data,
      ) 
      return response.data 
    },
    onSuccess: (_, formData) => {
      toast.success('Email sent successful, check you inbox and enter OTP in the second step.') 
      router.push(`/auth/forgot-password?step=2&email=${formData.email}`)
      start()
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Failed to send email' 
        toast.error(message) 
      } else if (error instanceof Error) {
        toast.error(error.message) 
      } else {
        toast.error('An unknown error occurred') 
      }
    },
  }) 

  async function onSubmit(values: z.infer<typeof ForgotPasswordFormSchema>) {
    forgotPasswordMutation.mutate(values)
  }

  return (
    <AuthForm
      title='Forgot Password'
      description='Enter your email to reset your password.'
      backButtonHref='/auth/login'
      backButtonLabel='Go back to login page'
      form={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                disabled={forgotPasswordMutation.isPending}
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="johndoe@mail.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={forgotPasswordMutation.isPending}
                className="w-full"
              >
                Send Email
                {forgotPasswordMutation.isPending && (
                  <LoaderIcon className='size-5' />
                )}
              </Button>
            </div>
          </form>
        </Form>
      }
    />
  )
}
