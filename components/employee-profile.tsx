"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmployeePayslips } from "@/components/employee-payslips"
import { EmployeeAttendance } from "@/components/employee-attendance"
import { EmployeeSalary } from "@/components/employee-salary"
import { EmployeeDocuments } from "@/components/employee-documents"
import { EmployeePayrollStructure } from "@/components/employee-payroll-structure"

export function EmployeeProfile({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")

  // Set active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // This would normally fetch employee data based on the ID
  const employee = {
    id,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 123-4567",
    position: "Software Engineer",
    department: "Engineering",
    status: "Active",
    joinDate: "Apr 2, 2025",
    reportingTo: "Jane Smith (CTO)",
    employmentType: "Full Time",
    workLocation: "Headquarters",
    address: "123 Main St, Anytown, CA 12345",
    payrollStructure: "Standard Staff Payroll",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex flex-col items-center gap-4 md:w-1/4">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={`/placeholder.svg?height=128&width=128&text=${employee.name.charAt(0)}`}
                  alt={employee.name}
                />
                <AvatarFallback className="text-4xl">
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">{employee.name}</h2>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
                <Badge className="mt-2">{employee.status}</Badge>
              </div>
              <div className="grid w-full grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  Message
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  Terminate
                </Button>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{employee.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p>{employee.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                  <p>{employee.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Join Date</h3>
                  <p>{employee.joinDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Reporting To</h3>
                  <p>{employee.reportingTo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Employment Type</h3>
                  <p>{employee.employmentType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Work Location</h3>
                  <p>{employee.workLocation}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Employee ID</h3>
                  <p>EMP-{employee.id.padStart(5, "0")}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                <p>{employee.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payroll Structure</h3>
                <Badge variant="outline" className="bg-primary/5">
                  {employee.payrollStructure}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="salary">Salary Info</TabsTrigger>
          <TabsTrigger value="payroll-structure">Payroll Structure</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Summary</CardTitle>
              <CardDescription>Overview of employee performance and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Current Salary</h3>
                  <p className="mt-1 text-2xl font-bold">$85,000</p>
                  <p className="text-xs text-muted-foreground">Annual</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Leave Balance</h3>
                  <p className="mt-1 text-2xl font-bold">15 days</p>
                  <p className="text-xs text-muted-foreground">Remaining for 2025</p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Time at Company</h3>
                  <p className="mt-1 text-2xl font-bold">2 months</p>
                  <p className="text-xs text-muted-foreground">Since Apr 2, 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Badge variant="outline" className="h-2 w-2 rounded-full bg-primary p-0" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Salary Updated</p>
                      <p className="text-xs text-muted-foreground">May 15, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Badge variant="outline" className="h-2 w-2 rounded-full bg-primary p-0" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Leave Approved</p>
                      <p className="text-xs text-muted-foreground">May 10, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Badge variant="outline" className="h-2 w-2 rounded-full bg-primary p-0" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payslip Generated</p>
                      <p className="text-xs text-muted-foreground">Apr 30, 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-3">
                    <p className="text-sm">
                      Robert is a skilled software engineer with expertise in React and Node.js.
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">Added by Jane Smith on Apr 5, 2025</p>
                  </div>
                  <div className="rounded-md border p-3">
                    <p className="text-sm">Completed onboarding process successfully.</p>
                    <p className="mt-2 text-xs text-muted-foreground">Added by HR on Apr 3, 2025</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="salary" className="pt-4">
          <EmployeeSalary />
        </TabsContent>
        <TabsContent value="payroll-structure" className="pt-4">
          <EmployeePayrollStructure />
        </TabsContent>
        <TabsContent value="attendance" className="pt-4">
          <EmployeeAttendance />
        </TabsContent>
        <TabsContent value="payslips" className="pt-4">
          <EmployeePayslips />
        </TabsContent>
        <TabsContent value="documents" className="pt-4">
          <EmployeeDocuments />
        </TabsContent>
      </Tabs>
    </div>
  )
}
