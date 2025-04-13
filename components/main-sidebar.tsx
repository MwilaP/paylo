"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Calendar, CreditCard, FileText, Home, Settings, Users, Clock, LogOut, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MainSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background md:block md:w-64">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <CreditCard className="h-6 w-6 text-primary" />
          <span>Paylo</span>
        </Link>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <NavItem href="/dashboard" icon={Home} label="Dashboard" isActive={pathname === "/dashboard"} />
            <NavItem href="/employees" icon={Users} label="Employees" isActive={pathname.startsWith("/employees")} />
            <NavItem href="/attendance" icon={Clock} label="Attendance" isActive={pathname.startsWith("/attendance")} />
            <NavItem href="/leave" icon={Calendar} label="Leave" isActive={pathname.startsWith("/leave")} />
            <NavItem href="/payroll" icon={CreditCard} label="Payroll" isActive={pathname.startsWith("/payroll")} />
            <NavItem href="/payslips" icon={FileText} label="Payslips" isActive={pathname.startsWith("/payslips")} />
            <NavItem href="/reports" icon={BarChart3} label="Reports" isActive={pathname.startsWith("/reports")} />
            <NavItem href="/settings" icon={Settings} label="Settings" isActive={pathname.startsWith("/settings")} />
          </nav>
          <div className="mt-auto">
            <NavItem href="/profile" icon={User} label="My Profile" isActive={pathname === "/profile"} />
            <NavItem href="/login" icon={LogOut} label="Logout" isActive={false} />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string
  icon: React.ElementRef<typeof Home>
  label: string
  isActive: boolean
}) {
  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      className={cn("justify-start gap-2", isActive && "font-medium")}
    >
      <Link href={href}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  )
}
