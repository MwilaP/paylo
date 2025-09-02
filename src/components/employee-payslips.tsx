import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Mail } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton" // Added for loading state

// Define props interface
interface EmployeePayslipsProps {
  payslips: any[] // Ideally, define a stricter type based on PayrollRecord
  isLoading: boolean
  error: string | null
}

// Helper function to format date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A"
  try {
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch (e) {
    return "Invalid Date"
  }
}

// Helper function to format currency
const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return "N/A"
  return `K${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function EmployeePayslips({ payslips, isLoading, error }: EmployeePayslipsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payslips</CardTitle>
        <CardDescription>View and download employee payslips</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <p className="text-destructive">Error loading payslips: {error}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Gross Pay</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payslips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No payslips found for this employee.
                  </TableCell>
                </TableRow>
              ) : (
                payslips.map((payslip) => (
                  <TableRow key={payslip._id}>
                    <TableCell>{payslip.period || "N/A"}</TableCell> {/* Assuming 'period' field exists */}
                    <TableCell>{formatDate(payslip.date)}</TableCell> {/* Assuming 'date' is issue date */}
                    <TableCell>{formatCurrency(payslip.grossPay)}</TableCell> {/* Assuming 'grossPay' field exists */}
                    <TableCell>{formatCurrency(payslip.totalDeductions)}</TableCell> {/* Assuming 'totalDeductions' field exists */}
                    <TableCell>{formatCurrency(payslip.netPay)}</TableCell> {/* Assuming 'netPay' field exists */}
                    <TableCell>
                      <Badge variant={payslip.status === 'paid' ? 'default' : 'secondary'}>
                        {payslip.status || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" disabled> {/* Actions disabled for now */}
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="outline" size="icon" disabled>
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button variant="outline" size="icon" disabled>
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
