"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If authentication is still loading, wait
    if (isLoading) return

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Show nothing while loading or redirecting
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  // If authenticated, show the protected content
  return <>{children}</>
}