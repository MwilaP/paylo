import Link from "next/link"
import { CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
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
          <CardTitle className="text-xl">Reset your password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full">Send reset link</Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">Back to login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
