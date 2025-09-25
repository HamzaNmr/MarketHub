"use client"

import { Fragment } from 'react'
import RegisterForm from './register-form'
import VerifyOtpForm from './verify-otp-form'
import { useAuthState } from '../../hooks/use-auth-state'

export default function RegisterWrapper() {
  const { showOtp } = useAuthState()
 
  return (
    <Fragment>
        {!showOtp ? (
          <RegisterForm />
        ): (
          <VerifyOtpForm />
        )}
    </Fragment>
  )
}
