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

import { PasswordInput } from '@shadcn/components/password-input'
// import { PhoneInput } from '@shadcn/components/phone-input'
import AuthForm from './auth-form'
import { RegisterFormSchema } from '../../lib/validation.schemas'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { LoaderIcon } from 'lucide-react'
import { useResendTimer } from '../../hooks/use-resend-timer'
import { useAuthState } from '../../hooks/use-auth-state'

export default function RegisterForm() {
  const { setUserData, setShowOtp } = useAuthState()
  const { start } = useResendTimer(60)

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: '',
      email: '',
      // phone: '',
      password: '',
      // confirm_password: '',
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (data: z.infer<typeof RegisterFormSchema>) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`,
        data
      ) 
      return response.data 
    },
    onSuccess: (_, formData) => {
      setUserData(formData) 
      setShowOtp(true) 
      start() 
      toast.success('Registration successful! Please verify your account.') 
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Failed to register' 
        toast.error(message) 
      } else if (error instanceof Error) {
        toast.error(error.message) 
      } else {
        toast.error('An unknown error occurred') 
      }
    },
  }) 

  async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
    registerMutation.mutate(values)
  }

  return (
    <AuthForm
      title='Register to MarketHub'
      description='Create a new account by filling out the form below.'
      backButtonHref='/auth/register'
      backButtonLabel='Don&apos;t have an account? Register'
      showOAuth
      form={
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="name">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          disabled={registerMutation.isPending}
                          id="name" 
                          placeholder="John Doe" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={registerMutation.isPending}
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

                {/* <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="phone">Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput {...field} defaultCountry="LB" disabled={registerMutation.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          disabled={registerMutation.isPending}
                          id="password"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          disabled={registerMutation.isPending}
                          id="confirmPassword"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <Button 
                  disabled={registerMutation.isPending}
                  type="submit" 
                  className="w-full"
                >
                  Register 
                  {registerMutation.isPending && (
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
