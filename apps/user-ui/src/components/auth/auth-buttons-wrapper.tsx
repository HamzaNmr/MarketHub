import React from 'react'
import LoginButton from './login-button'
import RegisterButton from './register-button'

export default function AuthButtonsWrapper() {
  return (
    <div className="flex items-center gap-3">
        <LoginButton />
        <RegisterButton />
    </div>
  )
}
