'use client'

import Link from 'next/link'
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
import AuthForm from './auth-form'
import { Checkbox } from '@shadcn/components/checkbox'
import { LoginFormSchema } from '../../lib/validation.schemas'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { LoaderIcon } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof LoginFormSchema>) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-user`,
        data,
        { withCredentials: true }
      ) 
      return response.data 
    },
    onSuccess: (_) => {
      toast.success('Login successful, Welcome!') 
      router.push('/')
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Failed to login' 
        toast.error(message) 
      } else if (error instanceof Error) {
        toast.error(error.message) 
      } else {
        toast.error('An unknown error occurred') 
      }
    },
  }) 

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    loginMutation.mutate(values)
  }

  return (
    <AuthForm
      title='Login to MarketHub'
      description='Enter your email and password to login to your account.'
      backButtonHref='/auth/login'
      backButtonLabel='Don&apos;t have an account? Register'
      showOAuth
      form={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                disabled={loginMutation.isPending}
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
              <FormField
                control={form.control}
                name="password"
                disabled={loginMutation.isPending}
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
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
              <FormField
                control={form.control}
                name="remember_me"
                disabled={loginMutation.isPending}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Remember me</FormLabel>
                      
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={loginMutation.isPending}
                className="w-full"
              >
                Login
                {loginMutation.isPending && (
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
