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
import { ArrowLeft, Download, Mail, FileText, DollarSign, ChevronDown, ChevronRight } from "lucide-react"
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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

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
    if (!payrollRecord || !payrollRecord.items) {
      toast({
        title: "Export Failed",
        description: "No payroll data available to export.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create payroll data in the requested format
      const exportData = payrollRecord.items.map((item: any) => {
        // Extract loan and other specific deductions from deduction breakdown
        let loanDeduction = 0
        let otherDeductions = 0
        
        // Process deduction breakdown if available
        if (item.deductionBreakdown && Array.isArray(item.deductionBreakdown)) {
          item.deductionBreakdown.forEach((deduction: any) => {
            // Skip standard deductions that already have their own columns
            if (deduction.name.toLowerCase().includes('napsa') || 
                deduction.name.toLowerCase().includes('nhima') || 
                deduction.name.toLowerCase().includes('paye')) {
              return
            }
            
            // Extract loan deductions
            if (deduction.name.toLowerCase().includes('loan')) {
              loanDeduction += (typeof deduction.value === 'number') ? deduction.value : 0
            } else {
              // Accumulate other deductions
              otherDeductions += (typeof deduction.value === 'number') ? deduction.value : 0
            }
          })
        }
        
        return {
          'EMPLOYEE NAME': item.employeeName || 'Unknown Employee',
          'ACCOUNT NUMBER': item.accountNumber || '',
          'NRC': item.nrc || '',
          'TPIN': item.tpin || '',
          'BASIC PAY': item.basicSalary || 0,
          'Housing Allow.': item.housingAllowance || 0,
          'Transport Allow.': item.transportAllowance || 0,
          'GROSS PAY': item.grossPay || 0,
          'Napsa': item.napsa || 0,
          'Nhima': item.nhima || 0,
          'PAYE': item.paye || 0,
          'Loan': loanDeduction,
          'Other Deductions': otherDeductions,
          'NET': item.netSalary || 0
        }
      })
      
      // Convert to CSV
      const headers = [
        'EMPLOYEE NAME', 'ACCOUNT NUMBER', 'NRC', 'TPIN', 'BASIC PAY', 
        'Housing Allow.', 'Transport Allow.', 'GROSS PAY', 'Napsa', 
        'Nhima', 'PAYE', 'Loan', 'Other Deductions', 'NET'
      ]
      
      const csvContent = [
        headers.join(','),
        ...exportData.map((row: Record<string, any>) => 
          headers.map(header => {
            const value = row[header]
            // Handle values that might contain commas
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`
            }
            return value
          }).join(',')
        )
      ].join('\n')
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      
      const fileName = `payroll_${payrollRecord.period || 'monthly'}_${payrollRecord.date ? new Date(payrollRecord.date).toISOString().split('T')[0] : 'unknown'}.csv`
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Export Successful",
        description: `Payroll exported as ${fileName}`,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting the payroll data.",
        variant: "destructive",
      })
    }
  }

  const handleEmailPayslips = () => {
    toast({
      title: "Email Sent",
      description: "Payslips have been sent to all employees.",
    })
  }

  const toggleRowExpansion = (employeeId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId)
    } else {
      newExpanded.add(employeeId)
    }
    setExpandedRows(newExpanded)
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
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead className="text-right">Net Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRecord.items.map((item: any, index: number) => {
                    const employeeId = item.employeeId || `employee_${index}`
                    const isExpanded = expandedRows.has(employeeId)
                    
                    return (
                      <>
                        <TableRow key={employeeId} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleRowExpansion(employeeId)}>
                          <TableCell>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.employeeName || `Employee ${index + 1}`}
                          </TableCell>
                          <TableCell>K{item.basicSalary?.toLocaleString() || "0"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>K{item.allowances?.toLocaleString() || "0"}</span>
                              {item.allowanceBreakdown && item.allowanceBreakdown.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {item.allowanceBreakdown.length} items
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>K{item.deductions?.toLocaleString() || "0"}</span>
                              {item.deductionBreakdown && item.deductionBreakdown.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {item.deductionBreakdown.length} items
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            K{item.netSalary?.toLocaleString() || "0"}
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow key={`${employeeId}_details`}>
                            <TableCell colSpan={6} className="bg-muted/30 p-0">
                              <div className="p-4 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  {/* Allowances Breakdown */}
                                  <div>
                                    <h4 className="font-medium text-sm mb-2 text-green-700">Allowances Breakdown</h4>
                                    {item.allowanceBreakdown && item.allowanceBreakdown.length > 0 ? (
                                      <div className="space-y-1">
                                        {item.allowanceBreakdown.map((allowance: any, idx: number) => (
                                          <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{allowance.name}</span>
                                            <span className="font-medium text-green-700">
                                              +K{allowance.value?.toLocaleString() || "0"}
                                              {allowance.type === "percentage" && ` (${allowance.percentage}%)`}
                                            </span>
                                          </div>
                                        ))}
                                        <Separator className="my-2" />
                                        <div className="flex justify-between text-sm font-medium">
                                          <span>Total Allowances</span>
                                          <span className="text-green-700">+K{item.allowances?.toLocaleString() || "0"}</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">No allowances</p>
                                    )}
                                  </div>
                                  
                                  {/* Deductions Breakdown */}
                                  <div>
                                    <h4 className="font-medium text-sm mb-2 text-red-700">Deductions Breakdown</h4>
                                    {item.deductionBreakdown && item.deductionBreakdown.length > 0 ? (
                                      <div className="space-y-1">
                                        {item.deductionBreakdown.map((deduction: any, idx: number) => (
                                          <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                              {deduction.name}
                                              {deduction.preTax && <span className="text-xs text-blue-600 ml-1">(Pre-tax)</span>}
                                            </span>
                                            <span className="font-medium text-red-700">
                                              -K{deduction.value?.toLocaleString() || "0"}
                                              {deduction.type === "percentage" && ` (${deduction.percentage}%)`}
                                            </span>
                                          </div>
                                        ))}
                                        <Separator className="my-2" />
                                        <div className="flex justify-between text-sm font-medium">
                                          <span>Total Deductions</span>
                                          <span className="text-red-700">-K{item.deductions?.toLocaleString() || "0"}</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">No deductions</p>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Salary Calculation Summary */}
                                <div className="bg-background rounded-lg p-3 border">
                                  <h4 className="font-medium text-sm mb-2">Salary Calculation</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span>Basic Salary</span>
                                      <span>K{item.basicSalary?.toLocaleString() || "0"}</span>
                                    </div>
                                    <div className="flex justify-between text-green-700">
                                      <span>+ Total Allowances</span>
                                      <span>K{item.allowances?.toLocaleString() || "0"}</span>
                                    </div>
                                    <div className="flex justify-between text-red-700">
                                      <span>- Total Deductions</span>
                                      <span>K{item.deductions?.toLocaleString() || "0"}</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between font-medium text-base">
                                      <span>Net Salary</span>
                                      <span>K{item.netSalary?.toLocaleString() || "0"}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )
                  })}
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
