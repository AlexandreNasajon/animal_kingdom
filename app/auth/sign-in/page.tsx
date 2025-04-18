import { SignInForm } from "@/components/auth/sign-in-form"
import { MenuBackgroundAnimation } from "@/components/menu-background-animation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bioquest-bg">
      <MenuBackgroundAnimation />
      <div className="z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 embossed-title">Bioquest</h1>
          <p className="text-green-300">Sign in to play online</p>
        </div>
        <div className="bg-black/50 p-6 rounded-lg border border-green-600">
          <SignInForm showLinks={true} />
        </div>

        <div className="mt-6 text-center">
          <Link href="/">
            <Button variant="outline" className="bg-green-800/50 border-green-600 hover:bg-green-700 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Main Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
