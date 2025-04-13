import Link from "next/link"
import { CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <CreditCard className="h-8 w-8 text-primary" />
              <span>Paylo</span>
            </div>
          </div>
          <CardTitle className="text-xl">Sign in to your account</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/reset-password" className="text-xs text-primary underline underline-offset-4">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href="/dashboard">Sign in</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
