import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Mail, FileText, DollarSign } from "lucide-react"
import { getPayrollHistoryService } from "@/lib/db/services/service-factory"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

export default function PayrollHistoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [payrollRecord, setPayrollRecord] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPayrollRecord = async () => {
      if (!id) {
        setError("No payroll ID provided")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const payrollService = await getPayrollHistoryService()
        const record = await payrollService.getPayrollRecordById(id)
        
        if (!record) {
          setError("Payroll record not found")
        } else {
          setPayrollRecord(record)
        }
      } catch (err: any) {
        console.error("Error loading payroll record:", err)
        setError(err.message || "Failed to load payroll record")
      } finally {
        setIsLoading(false)
      }
    }

    loadPayrollRecord()
  }, [id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleExportPayroll = () => {
    toast({
      title: "Export Started",
      description: "Payroll export will be available shortly.",
    })
  }

  const handleEmailPayslips = () => {
    toast({
      title: "Email Sent",
      description: "Payslips have been sent to all employees.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/payroll")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payroll
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-destructive">Error</h3>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!payrollRecord) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/payroll")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payroll
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Payroll Record Not Found</h3>
              <p className="text-sm text-muted-foreground mt-2">The requested payroll record could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/payroll")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payroll
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {payrollRecord.period || "Monthly Payroll"}
            </h2>
            <p className="text-muted-foreground">
              {payrollRecord.date ? format(new Date(payrollRecord.date), "MMMM yyyy") : "Date unknown"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportPayroll}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleEmailPayslips}>
            <Mail className="mr-2 h-4 w-4" />
            Email Payslips
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payroll Summary</CardTitle>
              <CardDescription>Overview of this payroll period</CardDescription>
            </div>
            {getStatusBadge(payrollRecord.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Total Amount</h3>
              <p className="mt-1 text-2xl font-bold">
                K{payrollRecord.totalAmount?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Employees</h3>
              <p className="mt-1 text-2xl font-bold">
                {payrollRecord.employeeCount || 0}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Processed Date</h3>
              <p className="mt-1 text-lg font-medium">
                {payrollRecord.processedAt 
                  ? format(new Date(payrollRecord.processedAt), "MMM dd, yyyy")
                  : "Not processed"
                }
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Processed By</h3>
              <p className="mt-1 text-lg font-medium">
                {payrollRecord.processedBy || "System"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Details */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Breakdown</CardTitle>
          <CardDescription>Individual employee payroll details</CardDescription>
        </CardHeader>
        <CardContent>
          {payrollRecord.items && payrollRecord.items.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead className="text-right">Net Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRecord.items.map((item: any, index: number) => (
                    <TableRow key={item.employeeId || index}>
                      <TableCell className="font-medium">
                        {item.employeeName || `Employee ${index + 1}`}
                      </TableCell>
                      <TableCell>K{item.basicSalary?.toLocaleString() || "0"}</TableCell>
                      <TableCell>K{item.allowances?.toLocaleString() || "0"}</TableCell>
                      <TableCell>K{item.deductions?.toLocaleString() || "0"}</TableCell>
                      <TableCell className="text-right font-medium">
                        K{item.netSalary?.toLocaleString() || "0"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Employee Data</h3>
              <p className="text-sm text-muted-foreground mt-2">
                No individual employee breakdown available for this payroll.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      {payrollRecord.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{payrollRecord.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
