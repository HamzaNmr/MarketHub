import { buttonVariants } from '@shadcn/components/button'
import Link from 'next/link'
import React from 'react'

export default function RegisterButton() {
  return (
    <Link 
      href={"/register"} 
      className={buttonVariants({ variant: "secondary"})}
    >
      Register
    </Link>
  )
}
