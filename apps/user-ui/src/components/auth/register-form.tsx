'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Form,
  FormControl,
  FormDescription,
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
import { Fragment, useState } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@shadcn/components/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'

export default function RegisterForm() {
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(true)
  const [showOtp, setShowOtp] = useState(true)

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: '',
      email: '',
      // phone: '',
      password: '',
      // confirm_password: '',
      otp: '',
    },
  })

  async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
    try {
      console.log(values)

      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {`
            Email: ${values.email}
            Password: ${values.password}
            `}
          </code>
        </pre>,
      )
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Failed to submit the form. Please try again.')
    }
  }

  const resendOtp = () => {

  }

  return (
    <Fragment>
      {!showOtp ? (
        <AuthForm
          title='Register to MarketHub'
          description='Create a new account by filling out the form below.'
          backButtonHref='/register'
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
                            <Input id="name" placeholder="John Doe" {...field} />
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
                            <PhoneInput {...field} defaultCountry="LB" />
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
    
                    <Button type="submit" className="w-full">
                      Register
                    </Button>
                  </div>
                </form>
              </Form>
          }
        />
      ): (
        <AuthForm 
          title='One-Time Password'
          description='Enter the OTP to verify your account.'
          showOAuth
          form={
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
              <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <InputOTP 
                          maxLength={4} 
                          {...field} 
                          pattern={REGEXP_ONLY_DIGITS}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className='w-full'
                >
                  Verify OTP
                </Button>
                  {canResend ? (
                    <span
                      className='text-sm text-foreground/70 hover:underline cursor-pointer'
                      onClick={resendOtp}
                    >
                      Resend OTP
                    </span>
                  ): (
                    <span>
                      Resend OTP in {timer}{' '}s
                    </span>
                  )}
              </form>
            </Form>
          }
        />
      )}
    </Fragment>
  )
}
