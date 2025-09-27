'use client'

import { Image } from '@heroui/image'
import { Link } from '@heroui/react'
import VerifyEmail from '@/app/forgot-password/components/VerifyEmail'
import RightSide from '@/app/login/components/RightSide'
import Footer from '@/app/login/components/Footer'
import OtpForm from '@/app/forgot-password/components/OtpForm'
import ResetPasswordForm from '@/app/forgot-password/components/ResetPasswordForm'
import { useState } from 'react'

export type Step = 'verify-email' | 'otp' | 'reset-password'

const ForgotPasswordFlow = () => {
  const [step, setStep] = useState<Step>('verify-email')
  const [email, setEmail] = useState('')

  return (
    <>
      {step === 'otp' ? (
        <OtpForm setStep={setStep} />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="grid h-full min-h-screen lg:grid-cols-2">
            <div className="flex flex-col justify-between px-4 py-4 min-h-screen">
              <div className="flex justify-center">
                <div className="w-full max-w-[250px] text-center">
                  <center>
                    <Link href="/" className="cursor-pointer">
                      <Image
                        src="/logo.png"
                        alt="logo"
                        className="w-30 h-30 object-contain"
                      />
                    </Link>
                  </center>
                </div>
              </div>

              <div className="flex justify-center flex-1 items-center">
                <div className="w-full max-w-[450px] space-y-8">
                  {step === 'verify-email' && (
                    <VerifyEmail
                      setStep={setStep}
                      setEmail={setEmail}
                      email={email}
                    />
                  )}
                  {step === 'reset-password' && (
                    <ResetPasswordForm email={email} />
                  )}
                  <div className="text-center mt-2">
                    <Link href="/login" className="text-blue-600">
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>

              <Footer />
            </div>

            <RightSide />
          </div>
        </div>
      )}
    </>
  )
}

export default ForgotPasswordFlow
