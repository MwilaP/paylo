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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">No payroll processed yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees Paid</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No employees paid yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payroll</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--/--/----</div>
            <p className="text-xs text-muted-foreground">No upcoming payroll scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payroll Structures</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/payroll/structures" className="text-primary hover:underline">
                Create structures
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Getting Started with Payroll</CardTitle>
            <CardDescription>Follow these steps to set up your payroll system</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">1. Create Payroll Structures</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Define how employee salaries are calculated, including basic salary, allowances, and deductions.
                  </p>
                  <Button asChild className="mt-2" variant="outline" size="sm">
                    <Link href="/payroll/structures">Create Structures</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">2. Add Employees</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create employee profiles with personal details, job information, and banking details.
                  </p>
                  <Button asChild className="mt-2" variant="outline" size="sm">
                    <Link href="/employees/new">Add Employees</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">3. Assign Payroll Structures</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Assign the appropriate payroll structure to each employee based on their role and contract.
                  </p>
                  <Button asChild className="mt-2" variant="outline" size="sm">
                    <Link href="/payroll/structures">Assign Structures</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">4. Generate Payroll</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Process payroll for your employees based on their assigned structures and generate payslips.
                  </p>
                  <Button asChild className="mt-2" variant="outline" size="sm">
                    <Link href="/payroll/generate">Generate Payroll</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history" className="mt-6">
        <TabsList>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4">
          <PayrollHistory />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <PayrollSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
