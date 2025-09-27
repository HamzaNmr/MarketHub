"use client"

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import AuthForm from './auth-form'
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@shadcn/components/form'
import { 
    InputOTP, 
    InputOTPGroup, 
    InputOTPSlot 
} from '@shadcn/components/input-otp'
import { Button } from '@shadcn/components/button'
import { LoaderIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useResendTimer } from '../../hooks/use-resend-timer'
import { VerifyOtpFormSchema } from '../../lib/validation.schemas'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { REGEXP_ONLY_DIGITS } from 'input-otp'

export default function VerifyOtpForgotPasswordForm() {
    const { timer, canResend } = useResendTimer(60)
    const searchParams = useSearchParams()
    const router = useRouter()

    const form = useForm<z.infer<typeof VerifyOtpFormSchema>>({
        resolver: zodResolver(VerifyOtpFormSchema),
        defaultValues: {
        otp: '',
        },
    })

    const verifyOtpMutation = useMutation({
        mutationFn: async (data: z.infer<typeof VerifyOtpFormSchema>) => {
            const userEmail = searchParams.get("email")
            if (!userEmail) throw new Error('User data not found') 
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
                {
                email: userEmail,
                otp: data.otp,
                }
            ) 
            return response.data 
        },
        onSuccess: () => {
            toast.success('OTP verified successfully!')
            const userEmail = searchParams.get("email")
            router.push(`/auth/forgot-password?step=3&email=${userEmail}`) 
        },
        onError: (error: any) => {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || 'Failed to verify OTP'
                toast.error(message) 
            } else if (error instanceof Error) {
                toast.error(error.message) 
            } else {
                toast.error('An unknown error occurred') 
            }
        },
    }) 


    async function onSubmit(values: z.infer<typeof VerifyOtpFormSchema>) {
        verifyOtpMutation.mutate(values)
    }

    const resendOtp = () => {

    }

  return (
    <AuthForm 
      title='One-Time Password'
      description='Enter the OTP to verify your account.'
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
                      disabled={verifyOtpMutation.isPending}
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
              disabled={verifyOtpMutation.isPending}
              type='submit'
              className='w-full'
            >
              Verify OTP
              {verifyOtpMutation.isPending && (
                <LoaderIcon className='size-5' />
              )}
            </Button>
              {canResend ? (
                <span
                  className='text-sm text-foreground/70 hover:underline cursor-pointer'
                  onClick={resendOtp}
                >
                  Resend OTP
                </span>
              ): (
                <span
                  className='text-sm text-foreground/70 hover:underline cursor-pointer'
                >
                  Resend OTP in {timer}{' '}s
                </span>
              )}
          </form>
        </Form>
      }
    />
  )
}
