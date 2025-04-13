import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PayrollStructureDemo } from "@/components/demo/payroll-structure-demo"
import { PayrollStructureAssignDemo } from "@/components/demo/payroll-structure-assign-demo"
import { PayrollStructureEmployeeDemo } from "@/components/demo/payroll-structure-employee-demo"
import Link from "next/link"

export default function PayrollStructureDemoPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Structure Demo</h1>
          <p className="text-muted-foreground">Interactive demo to test the payroll structure feature</p>
        </div>
        <Button asChild>
          <Link href="/payroll/structures">Go to Payroll Structures</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Use This Demo</CardTitle>
          <CardDescription>
            This interactive demo allows you to test the payroll structure feature without affecting real data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <h3 className="font-medium">Demo Features:</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Create and edit payroll structures with real-time calculations</li>
              <li>Simulate assigning structures to employees</li>
              <li>View how structures appear in employee profiles</li>
              <li>Test different allowance and deduction combinations</li>
            </ul>
          </div>
          <p>
            Use the tabs below to navigate between different aspects of the payroll structure feature. All changes are
            temporary and will not affect your actual data.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Structure</TabsTrigger>
          <TabsTrigger value="assign">Assign to Employees</TabsTrigger>
          <TabsTrigger value="employee">Employee View</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <PayrollStructureDemo />
        </TabsContent>
        <TabsContent value="assign">
          <PayrollStructureAssignDemo />
        </TabsContent>
        <TabsContent value="employee">
          <PayrollStructureEmployeeDemo />
        </TabsContent>
      </Tabs>
    </div>
  )
}
