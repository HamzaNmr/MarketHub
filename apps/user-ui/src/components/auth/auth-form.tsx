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
    backButtonLabel?: string
    backButtonHref?: string
    showOAuth?: boolean
}
export default function AuthForm({
    title,
    description,
    form,
    backButtonLabel,
    backButtonHref = "/",
    showOAuth = false,
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
        {showOAuth && (
          <OAuthButtons />
        )}
        {backButtonLabel && (
            <div className="mt-4 text-center text-sm">
              <Link href={backButtonHref} className="underline">
                  {backButtonLabel}
              </Link>
            </div> 
        )}
      </CardContent>
    </Card>
  )
}
