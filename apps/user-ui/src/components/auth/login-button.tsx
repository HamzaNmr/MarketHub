import { buttonVariants } from '@shadcn/components/button'
import Link from 'next/link'
import React from 'react'

export default function LoginButton() {
  return (
    <Link 
      href={"/login"} 
      className={buttonVariants({ variant: "default"})}
    >
      Login
    </Link>
  )
}
