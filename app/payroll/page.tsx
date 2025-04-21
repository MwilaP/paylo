import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, CreditCard, DollarSign, Users, FileText, BarChart } from "lucide-react"
import { PayrollHistory } from "@/components/payroll-history"
import { PayrollSettings } from "@/components/payroll-settings"

export const metadata: Metadata = {
  title: "Payroll Management",
  description: "Manage your organization's payroll",
}

export default function PayrollPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Payroll</h2>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/payroll/structures">
              <FileText className="mr-2 h-4 w-4" />
              Manage Structures
            </Link>
          </Button>
          <Button asChild>
            <Link href="/payroll/generate">
              <DollarSign className="mr-2 h-4 w-4" />
              Generate Payroll
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="history" className="mt-6">
        <TabsList>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Summary</CardTitle>
              <CardDescription>Overview of recent payroll activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Last Payroll</h3>
                  <p className="mt-1 text-2xl font-bold">$245,678</p>
                  <p className="text-xs text-muted-foreground">March 2025</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Next Payroll</h3>
                  <p className="mt-1 text-2xl font-bold">$250,000</p>
                  <p className="text-xs text-muted-foreground">April 2025 (Estimated)</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">YTD Payroll</h3>
                  <p className="mt-1 text-2xl font-bold">$610,678</p>
                  <p className="text-xs text-muted-foreground">Jan - Mar 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <PayrollHistory />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <PayrollSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
