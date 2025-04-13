import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileEdit, Download } from "lucide-react"

export function EmployeePayrollStructure() {
  // Mock data for the assigned payroll structure
  const structure = {
    id: "1",
    name: "Standard Staff Payroll",
    frequency: "Monthly",
    basicSalary: 5000,
    allowances: [
      { id: "1", name: "Housing", type: "percentage", value: 20, amount: 1000 },
      { id: "2", name: "Transport", type: "fixed", value: 500, amount: 500 },
    ],
    deductions: [
      { id: "1", name: "Tax", type: "percentage", value: 10, preTax: true, amount: 650 },
      { id: "2", name: "Pension", type: "percentage", value: 5, preTax: true, amount: 325 },
      { id: "3", name: "Health Insurance", type: "fixed", value: 200, preTax: false, amount: 200 },
    ],
    grossPay: 6500,
    netPay: 5325,
    assignedDate: "Apr 5, 2025",
    assignedBy: "Emily Davis (HR Coordinator)",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Assigned Payroll Structure</CardTitle>
            <CardDescription>Current payroll structure and calculations</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileEdit className="mr-2 h-4 w-4" />
              Override Values
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 rounded-md border p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-medium">{structure.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Assigned on {structure.assignedDate} by {structure.assignedBy}
                </p>
              </div>
              <Badge variant="outline" className="md:self-start">
                {structure.frequency}
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-sm font-medium">Earnings</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Basic Salary</TableCell>
                    <TableCell>Fixed</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">${structure.basicSalary.toLocaleString()}</TableCell>
                  </TableRow>
                  {structure.allowances.map((allowance) => (
                    <TableRow key={allowance.id}>
                      <TableCell>{allowance.name}</TableCell>
                      <TableCell>{allowance.type === "percentage" ? "Percentage" : "Fixed"}</TableCell>
                      <TableCell className="text-right">
                        {allowance.type === "percentage" ? `${allowance.value}%` : `$${allowance.value}`}
                      </TableCell>
                      <TableCell className="text-right">${allowance.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-medium">
                    <TableCell>Total Earnings</TableCell>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell className="text-right">${structure.grossPay.toLocaleString()}</TableCell>
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
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {structure.deductions.map((deduction) => (
                    <TableRow key={deduction.id}>
                      <TableCell>
                        {deduction.name}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({deduction.preTax ? "Pre-Tax" : "Post-Tax"})
                        </span>
                      </TableCell>
                      <TableCell>{deduction.type === "percentage" ? "Percentage" : "Fixed"}</TableCell>
                      <TableCell className="text-right">
                        {deduction.type === "percentage" ? `${deduction.value}%` : `$${deduction.value}`}
                      </TableCell>
                      <TableCell className="text-right">${deduction.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-medium">
                    <TableCell>Total Deductions</TableCell>
                    <TableCell colSpan={2}></TableCell>
                    <TableCell className="text-right">
                      ${structure.deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-6 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Net Monthly Salary</h3>
              <p className="text-2xl font-bold">${structure.netPay.toLocaleString()}</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">Annual Salary</h3>
              <p className="text-lg font-medium">${(structure.netPay * 12).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Structure Change History</CardTitle>
          <CardDescription>Record of payroll structure changes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Previous Structure</TableHead>
                <TableHead>New Structure</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Apr 5, 2025</TableCell>
                <TableCell>-</TableCell>
                <TableCell>Standard Staff Payroll</TableCell>
                <TableCell>Emily Davis</TableCell>
                <TableCell>Initial assignment</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
