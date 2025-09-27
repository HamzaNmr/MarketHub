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
import { PasswordInput } from '@shadcn/components/password-input'
import AuthForm from './auth-form'
import { ResetPasswordFormSchema } from '../../lib/validation.schemas'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoaderIcon } from 'lucide-react'

export default function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
        resolver: zodResolver(ResetPasswordFormSchema),
        defaultValues: {
          password: '',
        },
    })

    const resetPasswordMutation = useMutation({
        mutationFn: async (data: z.infer<typeof ResetPasswordFormSchema>) => {
            const userEmail = searchParams.get("email")
            if (!userEmail) throw new Error('User data not found') 
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
                {
                    email: userEmail,
                    newPassword: data.password
                },
            ) 
            return response.data 
        },
        onSuccess: (_) => {
            toast.success('Reset Password successfully! Please login with your new password.') 
            router.push('/auth/login')
        },
        onError: (error: any) => {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Failed to reset password' 
                toast.error(message) 
            } else if (error instanceof Error) {
                toast.error(error.message) 
            } else {
                toast.error('An unknown error occurred') 
            }
        },
    }) 

    async function onSubmit(values: z.infer<typeof ResetPasswordFormSchema>) {
        resetPasswordMutation.mutate(values)
    }

  return (
    <AuthForm
      title='Reset Password'
      description='Enter your new password'
      form={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="password"
                disabled={resetPasswordMutation.isPending}
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <FormLabel htmlFor="password">Password</FormLabel>
                    </div>
                    <FormControl>
                      <PasswordInput
                        id="password"
                        placeholder="******"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={resetPasswordMutation.isPending}
                className="w-full"
              >
                Reset Password
                {resetPasswordMutation.isPending && (
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
