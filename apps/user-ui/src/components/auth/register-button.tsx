import { buttonVariants } from '@shadcn/components/button'
import Link from 'next/link'
import React from 'react'

export default function RegisterButton() {
  return (
    <Link 
      href={"/auth/register"} 
      className={buttonVariants({ variant: "secondary"})}
    >
      Register
    </Link>
  )
}
