import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

export function EmployeeSalary() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Salary Structure</CardTitle>
            <CardDescription>Current salary breakdown</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Edit Structure
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-sm font-medium">Earnings</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Base Salary</TableCell>
                    <TableCell className="text-right">$70,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Housing Allowance</TableCell>
                    <TableCell className="text-right">$8,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Transport Allowance</TableCell>
                    <TableCell className="text-right">$3,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Medical Allowance</TableCell>
                    <TableCell className="text-right">$4,000</TableCell>
                  </TableRow>
                  <TableRow className="font-medium">
                    <TableCell>Total Earnings</TableCell>
                    <TableCell className="text-right">$85,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium">Deductions</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Income Tax</TableCell>
                    <TableCell className="text-right">$17,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Pension Contribution</TableCell>
                    <TableCell className="text-right">$4,250</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Health Insurance</TableCell>
                    <TableCell className="text-right">$2,000</TableCell>
                  </TableRow>
                  <TableRow className="font-medium">
                    <TableCell>Total Deductions</TableCell>
                    <TableCell className="text-right">$23,250</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="mt-6 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Net Annual Salary</h3>
              <p className="text-2xl font-bold">$61,750</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">Monthly Salary</h3>
              <p className="text-lg font-medium">$5,145.83</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Salary History</CardTitle>
          <CardDescription>Record of salary changes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Previous Salary</TableHead>
                <TableHead>New Salary</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Apr 2, 2025</TableCell>
                <TableCell>-</TableCell>
                <TableCell>$85,000</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Initial salary on hiring</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Bonuses & One-time Payments</CardTitle>
          <CardDescription>Record of additional payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Bonus
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No bonuses or one-time payments recorded
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
