"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarSelector } from "@/components/avatar-selector"

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatarId: 1,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarSelect = (avatarId: number) => {
    setFormData((prev) => ({ ...prev, avatarId }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would register with a backend
    console.log("Signing up with:", formData)
    router.push("/game/menu")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-800 to-green-950 p-4">
      <Card className="w-full max-w-md border-2 border-green-700 bg-green-900/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Create Account</CardTitle>
          <CardDescription className="text-green-300">Join Animal Kingdom and start your adventure</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
                className="border-green-700 bg-green-950/50 text-white placeholder:text-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-green-700 bg-green-950/50 text-white placeholder:text-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border-green-700 bg-green-950/50 text-white placeholder:text-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="border-green-700 bg-green-950/50 text-white placeholder:text-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Select Avatar</Label>
              <AvatarSelector selectedId={formData.avatarId} onSelect={handleAvatarSelect} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-green-700 hover:bg-green-600">
              Create Account
            </Button>
            <div className="text-center text-sm text-green-300">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-green-400 hover:underline">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
