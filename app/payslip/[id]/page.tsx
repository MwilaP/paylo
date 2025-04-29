"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Download, Mail, Printer, ArrowLeft, FileText, CheckCircle, AlertCircle } from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

// Services and Models
import { getPayrollHistoryService } from "@/lib/db/services/service-factory"
import type { Payslip } from "@/lib/db/models/payslip.model"

interface PayslipDetailPageProps {
  params: {
    id: string
  }
}

export default function PayslipDetailPage({ params }: PayslipDetailPageProps) {
  const router = useRouter()
  const { id } = params

  const [payslips, setPayslips] = useState<Payslip[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  useEffect(() => {
    const fetchPayslipData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const payrollService = await getPayrollHistoryService()
        const payslipData = await payrollService.getPayslipsByPayrollHistory(id)

        if (!payslipData || payslipData.length === 0) {
          setError("Payslip not found")
          return
        }

        setPayslips(payslipData)
      } catch (error) {
        console.error("Error fetching payslip:", error)
        setError("Failed to load payslip data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayslipData()
  }, [id])

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ZMW',
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP')
    } catch (error) {
      return dateString
    }
  }

  // Handle print payslip
  // Handle print payslip
  const handlePrintPayslip = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank')

    if (!printWindow) {
      alert('Please allow pop-ups to print the payslip')
      return
    }

    // Get all the payslip content
    const payslipContents = document.querySelectorAll('.payslip-content')

    // Setup the print window document
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payslip</title>
      <style>
        @page {
          size: A4;
          margin: 1cm;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #333;
          background-color: #fff;
        }
        .payslip {
          width: 100%;
          max-width: 800px;
          margin: 0 auto 20px;
          padding: 20px;
          border: 2px solid #ddd;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          page-break-after: always;
          background-color: #fff;
        }
        .payslip:last-child {
          page-break-after: auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          border-bottom: 2px solid #0052cc;
          padding-bottom: 15px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #0052cc;
        }
        .payslip-title {
          font-size: 20px;
          font-weight: bold;
          color: #0052cc;
          text-align: right;
        }
        .payslip-period {
          text-align: right;
          font-size: 14px;
          color: #555;
        }
        .info-section {
          display: flex;
          margin-bottom: 20px;
        }
        .info-column {
          flex: 1;
          padding: 10px;
        }
        .info-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #0052cc;
          font-size: 16px;
        }
        .info-item {
          margin-bottom: 5px;
          font-size: 14px;
        }
        .separator {
          border-top: 1px solid #ddd;
          margin: 15px 0;
        }
        .table-container {
          margin-bottom: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
          border: 1px solid #ddd;
        }
        thead {
          background-color: #f5f5f5;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
          border-right: 1px solid #ddd;
          font-size: 14px;
        }
        th:last-child, td:last-child {
          border-right: none;
        }
        th {
          font-weight: bold;
          color: #555;
        }
        .text-right {
          text-align: right;
        }
        .total-row {
          font-weight: bold;
          background-color: #f9f9f9;
        }
        .tables-container {
          display: flex;
          gap: 20px;
        }
        .table-section {
          flex: 1;
          border-bottom: 1px solid #0052cc;
        }
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 2px solid #0052cc;
        }
        .footer-label {
          font-size: 16px;
          font-weight: bold;
        }
        .total-amount {
          font-size: 20px;
          font-weight: bold;
          color: #0052cc;
        }
        .calculation {
          font-size: 14px;
          color: #555;
          margin-top: 5px;
        }
        .row {
          display: flex;
        }
        .payslip-logo {
          text-align: center;
          margin-bottom: 10px;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 100px;
          color: rgba(0, 0, 0, 0.05);
          z-index: -1;
        }
      </style>
    </head>
    <body>
  `)

    // Add each payslip to the print window
    payslipContents.forEach((content, index) => {
      if (payslips && payslips[index]) {
        const payslip = payslips[index];

        printWindow.document.write(`
        <div class="payslip">
          <div class="watermark">COPY</div>
          <div class="header">
            <div>
              <div class="company-name">ZAMBIAN WILA MOTORS</div>
            </div>
            <div>
              <div class="payslip-title">PAYSLIP</div>
              <div class="payslip-period">
                Period: ${formatDate(payslip.payPeriod.startDate)} - ${formatDate(payslip.payPeriod.endDate)}<br>
                Payment Date: ${formatDate(payslip.payPeriod.paymentDate)}
              </div>
            </div>
          </div>

          <div class="info-section">
            <div class="info-column">
              <div class="info-title">Employee Information</div>
              <div class="info-item">Name: ${payslip.employee.name}</div>
              <div class="info-item">Department: ${payslip.employee.department}</div>
              <div class="info-item">Employee ID: ${payslip.employee.id || 'N/A'}</div>
            </div>
            <div class="info-column">
              <div class="info-title">Payment Information</div>
              <div class="info-item">Basic Salary: ${formatCurrency(payslip.salary.basicSalary)}</div>
              <div class="info-item">Net Salary: ${formatCurrency(payslip.salary.netSalary)}</div>
              <div class="info-item">Payment Method: Bank Transfer</div>
            </div>
          </div>

          <div class="info-title">Earnings & Deductions</div>
          <div class="tables-container">
            <div class="table-section">
              <table>
                <thead>
                  <tr>
                    <th>Earnings</th>
                    <th class="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic Salary</td>
                    <td class="text-right">${formatCurrency(payslip.salary.basicSalary)}</td>
                  </tr>
                  ${payslip.salary?.allowances?.map((allowance: { id: string; name: string; calculatedAmount: number }) => `
                    <tr>
                      <td>${allowance.name}</td>
                      <td class="text-right">${formatCurrency(allowance.calculatedAmount)}</td>
                    </tr>
                  `).join('')}
                  <tr class="total-row">
                    <td>Total Earnings</td>
                    <td class="text-right">${formatCurrency(payslip.salary.grossSalary)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="table-section">
              <table>
                <thead>
                  <tr>
                    <th>Deductions</th>
                    <th class="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${payslip.salary?.deductions?.map((deduction: { id: string; name: string; calculatedAmount: number }) => `
                    <tr>
                      <td>${deduction.name}</td>
                      <td class="text-right">${formatCurrency(deduction.calculatedAmount)}</td>
                    </tr>
                  `).join('')}
                  <tr class="total-row">
                    <td>Total Deductions</td>
                    <td class="text-right">${formatCurrency(payslip.salary.totalDeductions)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="footer">
            <div>
              <div class="footer-label">Net Pay:</div>
              <div class="calculation">(${formatCurrency(payslip.salary.grossSalary)} - ${formatCurrency(payslip.salary.totalDeductions)})</div>
            </div>
            <div class="total-amount">${formatCurrency(payslip.salary.netSalary)}</div>
          </div>
        </div>
      `);
      }
    });

    // Close the HTML document
    printWindow.document.write(`
    </body>
    </html>
  `)

    // Wait for content to be loaded
    printWindow.document.close()
    printWindow.addEventListener('load', () => {
      // Print the document
      printWindow.print()
      // Close the print window after printing
      printWindow.addEventListener('afterprint', () => {
        printWindow.close()
      })
    })
  }

  // Handle download payslip
  const handleDownloadPayslip = () => {
    // Implementation for downloading payslip as PDF
    console.log("Downloading payslip:", id)
  }

  // Handle email payslip
  const handleEmailPayslip = async () => {
    try {
      setEmailStatus("sending")

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      setEmailStatus("success")

      // Reset after showing success message
      setTimeout(() => {
        setEmailDialogOpen(false)
        setEmailStatus("idle")
      }, 2000)
    } catch (error) {
      console.error("Error sending email:", error)
      setEmailStatus("error")
    }
  }

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusMap: Record<string, { label: string, variant: "default" | "secondary" | "destructive" | "outline" }> = {
      draft: { label: "Draft", variant: "outline" },
      processing: { label: "Processing", variant: "secondary" },
      completed: { label: "Completed", variant: "default" },
      cancelled: { label: "Cancelled", variant: "destructive" }
    }

    const { label, variant } = statusMap[status] || { label: status, variant: "outline" }

    return <Badge variant={variant}>{label}</Badge>
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>

        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  if (error || !payslips || payslips.length === 0) {
    return (
      <div className="container mx-auto py-6 space-y-8">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Payslip not found"}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Payslip Details</h1>
          {payslips.length > 0 && <StatusBadge status={payslips[0].status} />}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadPayslip}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={handlePrintPayslip}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Email Payslip</DialogTitle>
                <DialogDescription>
                  Send this payslip to the employee's email address.
                </DialogDescription>
              </DialogHeader>

              {emailStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                  <p className="text-center">Payslip sent successfully!</p>
                </div>
              ) : emailStatus === "error" ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to send email. Please try again.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="py-4">
                  <p>
                    This will send the payslip as a PDF attachment to the employee's registered email address.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Recipient:  Employees
                  </p>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleEmailPayslip}
                  disabled={emailStatus === "sending" || emailStatus === "success"}
                >
                  {emailStatus === "sending" ? "Sending..." : "Send Email"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Payslip Summary */}
      {payslips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payslip Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period:</span>
                <span className="font-medium">{payslips[0].payPeriod.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Date:</span>
                <span className="font-medium">{formatDate(payslips[0].payPeriod.paymentDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <StatusBadge status={payslips[0].status} />
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-medium">{formatCurrency(payslips.reduce((sum, p) => sum + p.salary.netSalary, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee Count:</span>
                <span className="font-medium">{payslips.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{payslips[0].createdAt ? formatDate(payslips[0].createdAt) : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">{payslips[0].updatedAt ? formatDate(payslips[0].updatedAt) : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Processed By:</span>
                <span className="font-medium">System</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">No notes available</p>
            </CardContent>
          </Card>
        </div>
      )}
      {payslips && payslips.map((payslip, index) => (
        <Card key={`payslip-${index}`} className="payslip-card">
          <CardHeader>
            <CardTitle>Payslip Preview</CardTitle>
            <CardDescription>
              Preview how the payslip will appear when printed or emailed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-8 bg-white payslip-content">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold">ZAMBIAN WILA MOTORS</h2>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-semibold">PAYSLIP</h3>
                  <p>Period: {formatDate(payslip.payPeriod.startDate)} - {formatDate(payslip.payPeriod.endDate)}</p>
                  <p>Payment Date: {formatDate(payslip.payPeriod.paymentDate)}</p>
                </div>
              </div>

              <Separator className="my-4 separator" />

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Employee Information</h4>
                    <p>Name: {payslip.employee.name}</p>
                    <p>Department: {payslip.employee.department}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Payment Information</h4>
                    <p>Basic Salary: {formatCurrency(payslip.salary.basicSalary)}</p>
                    <p>Net Salary: {formatCurrency(payslip.salary.netSalary)}</p>
                    <p>Payment Method: Bank Transfer</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Earnings & Deductions</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Earnings</th>
                            <th className="text-right py-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-2">Basic Salary</td>
                            <td className="text-right py-2">{formatCurrency(payslip.salary.basicSalary)}</td>
                          </tr>
                          {payslip.salary?.allowances?.map((allowance: { id: string; name: string; calculatedAmount: number }, idx: number) => (
                            <tr key={`allowance-${idx}`}>
                              <td className="py-2">{allowance.name}</td>
                              <td className="text-right py-2">{formatCurrency(allowance.calculatedAmount)}</td>
                            </tr>
                          ))}
                          <tr className="border-t">
                            <td className="py-2 font-semibold">Total Earnings</td>
                            <td className="text-right py-2 font-semibold">
                              {formatCurrency(payslip.salary.grossSalary)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Deductions</th>
                            <th className="text-right py-2">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payslip.salary?.deductions?.map((deduction: { id: string; name: string; calculatedAmount: number }, idx: number) => (
                            <tr key={`deduction-${idx}`}>
                              <td className="py-2">{deduction.name}</td>
                              <td className="text-right py-2">{formatCurrency(deduction.calculatedAmount)}</td>
                            </tr>
                          ))}
                          <tr className="border-t">
                            <td className="py-2 font-semibold">Total Deductions</td>
                            <td className="text-right py-2 font-semibold">{formatCurrency(payslip.salary.totalDeductions)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <Separator className="separator" />

                <div className="flex justify-between items-center footer">
                  <div className="text-lg font-semibold">Net Pay:</div>
                  <div className="text-xl font-bold total-amount">{formatCurrency(payslip.salary.netSalary)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}