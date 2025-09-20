'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@shadcn/components/card'
import { ReactNode } from 'react'
import OAuthButtons from './oauth-buttons'

interface AuthFormProps {
    title: string
    description: string
    form: ReactNode
    isLogin?: boolean
    isOAuth?: boolean
}
export default function AuthForm({
    title,
    description,
    form,
    isLogin = true,
    isOAuth = true,
}: AuthFormProps) {
  return (
    <Card className="mx-auto w-full md:w-md lg:w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {form}
        {isOAuth && (
          <OAuthButtons />
        )}
        {isLogin ? (
            <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
                Register
            </Link>
            </div> 
        ) : (
            <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                    Login
                </Link>
            </div> 
        )}
      </CardContent>
    </Card>
  )
}
