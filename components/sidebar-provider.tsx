"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import { MainSidebar } from "@/components/main-sidebar"
import { MainHeader } from "@/components/main-header"

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login" || pathname === "/reset-password"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <div className="flex flex-1">
        <MainSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
