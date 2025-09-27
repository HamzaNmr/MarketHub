"use client"

import { useEffect, useState } from "react"
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@shadcn/components/stepper"
import ForgotPasswordForm from "src/components/auth/forgot-password-form"
import { useRouter, useSearchParams } from "next/navigation"
import VerifyOtpForgotPasswordForm from "src/components/auth/verify-otp-forgot-password"
import ResetPasswordForm from "src/components/auth/reset-password-form"

const steps = [
  {
    step: 1,
    title: "Step One",
    description: "Send Email",
    component: <ForgotPasswordForm />,
  },
  {
    step: 2,
    title: "Step Two",
    description: "Verify OTP",
    component: <VerifyOtpForgotPasswordForm />,
  },
  {
    step: 3,
    title: "Step Three",
    description: "Reset Password",
    component: <ResetPasswordForm />,
  },
]

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const currentStep = Number(searchParams.get("step")) || 1
  const [activeStep, setActiveStep] = useState(currentStep)

  useEffect(() => {
    setActiveStep(currentStep)
  }, [currentStep])

  function handleStepChange(step: number) {
    setActiveStep(step)
    router.push(`/auth/forgot-password?step=${step}`)
  }

  return (
    <div className="space-y-8 text-center flex flex-col justify-center items-center">
      <div className="w-full md:w-md lg:w-xl">
        <Stepper 
          value={activeStep} 
          onValueChange={setActiveStep}
        >
          {steps.map(({ step, title, description }) => (
            <StepperItem
              key={step}
              step={step}
              className="not-last:flex-1 max-md:items-start"
            >
              <StepperTrigger className="rounded max-md:flex-col">
                <StepperIndicator />
                <div className="text-center md:text-left">
                  <StepperTitle>{title}</StepperTitle>
                  <StepperDescription className="max-sm:hidden">
                    {description}
                  </StepperDescription>
                </div>
              </StepperTrigger>
              {step < steps.length && (
                <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
              )}
            </StepperItem>
          ))}
        </Stepper>
      </div>

      <div className="mt-6">
        {steps.find((s) => s.step === activeStep)?.component}
      </div>
    </div>
  )
}
