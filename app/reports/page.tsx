import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PayrollReports } from "@/components/payroll-reports"
import { EmployeeReports } from "@/components/employee-reports"
import { TaxReports } from "@/components/tax-reports"
import { LeaveReports } from "@/components/leave-reports"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and view reports for your organization</p>
        </div>
        <Button>Generate Custom Report</Button>
      </div>
      <Tabs defaultValue="payroll">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
        </TabsList>
        <TabsContent value="payroll" className="space-y-4 pt-4">
          <PayrollReports />
        </TabsContent>
        <TabsContent value="employees" className="space-y-4 pt-4">
          <EmployeeReports />
        </TabsContent>
        <TabsContent value="tax" className="space-y-4 pt-4">
          <TaxReports />
        </TabsContent>
        <TabsContent value="leave" className="space-y-4 pt-4">
          <LeaveReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
