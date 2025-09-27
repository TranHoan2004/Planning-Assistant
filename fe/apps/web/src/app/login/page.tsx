import { Suspense } from 'react'
import { Image } from '@heroui/image'
import LoginForm from './components/LoginForm'
import RightSide from './components/RightSide'
import { Link } from '@heroui/link'
import Footer from '@/app/login/components/Footer'

export default function LoginPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid h-full min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <div className="flex flex-col justify-between px-4 py-4 min-h-screen">
          <div className="flex justify-center">
            <div className="w-full max-w-[250px] text-center">
              <center>
                <Link href="/" className="cursor-pointer">
                  <Image
                    src="/logo.png"
                    alt="logo"
                    className="w-30 h-30 object-contain"
                  />{' '}
                </Link>
              </center>
            </div>
          </div>

          <div className="flex justify-center flex-1 items-center">
            <div className="w-full max-w-[450px] space-y-8">
              <div className="w-full text-center space-y-2">
                <h2 className="text-6xl font-[700]">
                  Plan Less
                  <br />
                  Travel More
                </h2>
                <p className="text-gray-500 text-md mt-4">
                  The AI for planning and booking.{' '}
                  <Link href="/" className="text-orange-600">
                    Try it now !
                  </Link>
                </p>
              </div>
              <div className="w-full bg-white rounded-3xl shadow-md border border-gray-200 p-6 space-y-4">
                <Suspense>
                  <LoginForm />
                </Suspense>
              </div>
            </div>
          </div>

          <Footer/>
        </div>

        {/* Right Side */}
        <RightSide />
      </div>
    </div>
  )
}
