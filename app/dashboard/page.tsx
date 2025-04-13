import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Users, CalendarDays, FileText, BarChart4 } from "lucide-react"
import { DashboardChart } from "@/components/dashboard-chart"
import { RecentEmployees } from "@/components/recent-employees"
import { UpcomingPayroll } from "@/components/upcoming-payroll"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Payroll management dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/employees/new">
              <Users className="mr-2 h-4 w-4" />
              Add Employee
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
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/employees/new" className="text-primary hover:underline">
                Add employees
              </Link>
            </p>
          </CardContent>
        </Card>
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
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Follow these steps to set up your payroll system</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">1. Add Employees</h3>
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
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">2. Create Payroll Structures</h3>
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
                  <BarChart4 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">3. Generate Payroll</h3>
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

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Recent Employees</TabsTrigger>
          <TabsTrigger value="payroll">Upcoming Payroll</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DashboardChart />
        </TabsContent>
        <TabsContent value="employees" className="space-y-4">
          <RecentEmployees />
        </TabsContent>
        <TabsContent value="payroll" className="space-y-4">
          <UpcomingPayroll />
        </TabsContent>
      </Tabs>
    </div>
  )
}
