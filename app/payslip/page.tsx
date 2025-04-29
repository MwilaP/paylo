"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Download, Mail, Printer, Search, Filter, Calendar, ChevronDown } from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Services and Models
import { getPayrollHistoryService, getEmployeeService } from "@/lib/db/services/service-factory"
import type { PayrollHistory } from "@/lib/db/models/payroll-history.model"
import type { Employee } from "@/lib/db/models/employee.model"

export default function PayslipManagementPage() {
  // State for payroll data
  const [payrollHistory, setPayrollHistory] = useState<PayrollHistory[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPayslips, setSelectedPayslips] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [periodFilter, setPeriodFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Summary metrics
  const [summaryMetrics, setSummaryMetrics] = useState({
    totalPayroll: 0,
    payslipsGenerated: 0,
    pendingPayslips: 0,
    averageSalary: 0
  })

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Get services
        const payrollService = await getPayrollHistoryService()
        const employeeService = await getEmployeeService()

        // Fetch data
        const payrollData = await payrollService.getAllPayrollRecords()
        const employeeData = await employeeService.getAllEmployees()

        setPayrollHistory(payrollData)
        setEmployees(employeeData)

        // Calculate summary metrics
        const totalPayroll = payrollData.reduce((sum: number, record: PayrollHistory) => sum + record.totalAmount, 0)
        const pendingPayslips = payrollData.filter((record: PayrollHistory) => record.status === "draft" || record.status === "processing").length
        const averageSalary = payrollData.length > 0 ? totalPayroll / payrollData.length : 0

        setSummaryMetrics({
          totalPayroll,
          payslipsGenerated: payrollData.length,
          pendingPayslips,
          averageSalary
        })
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter payroll records based on search query and filters
  const filteredPayroll = payrollHistory.filter(record => {
    // Search by employee name
    const matchesSearch = record.items.some(item =>
      item.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Filter by period
    const matchesPeriod = periodFilter === "all" || record.period === periodFilter

    // Filter by status
    const matchesStatus = statusFilter === "all" || record.status === statusFilter

    return matchesSearch && matchesPeriod && matchesStatus
  })

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayslips(filteredPayroll.map(record => record._id))
    } else {
      setSelectedPayslips([])
    }
  }

  // Handle individual checkbox selection
  const handleSelectPayslip = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPayslips(prev => [...prev, id])
    } else {
      setSelectedPayslips(prev => prev.filter(payslipId => payslipId !== id))
    }
  }

  // Batch actions
  const handleBatchEmail = async () => {
    // Implementation for emailing selected payslips
    console.log("Emailing payslips:", selectedPayslips)
  }

  const handleBatchPrint = async () => {
    // Implementation for printing selected payslips
    console.log("Printing payslips:", selectedPayslips)
  }

  const handleBatchDownload = async () => {
    // Implementation for downloading selected payslips
    console.log("Downloading payslips:", selectedPayslips)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ZMW',
    }).format(amount)
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

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Payslip Management</h1>
        <div className="flex gap-2">
          <Link href="/payslip/template-designer">
            <Button>
              Template Designer
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Payroll
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summaryMetrics.totalPayroll)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current Month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Payslips Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryMetrics.payslipsGenerated}
            </div>
            <p className="text-xs text-muted-foreground">
              Current Month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payslips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryMetrics.pendingPayslips}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires Attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Salary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summaryMetrics.averageSalary)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per Employee
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Payslip Records</CardTitle>
          <CardDescription>
            View, manage, and process employee payslips
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <SelectValue placeholder="Period" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="April 2025">April 2025</SelectItem>
                <SelectItem value="March 2025">March 2025</SelectItem>
                <SelectItem value="February 2025">February 2025</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payslip Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedPayslips.length === filteredPayroll.length && filteredPayroll.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading payslip data...
                    </TableCell>
                  </TableRow>
                ) : filteredPayroll.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No payslip records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayroll.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedPayslips.includes(record._id)}
                          onCheckedChange={(checked) => handleSelectPayslip(record._id, !!checked)}
                        />
                      </TableCell>
                      <TableCell>
                        {record.items.length > 0 ? record.items[0].employeeName : "N/A"}
                      </TableCell>
                      <TableCell>{record.period}</TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{formatCurrency(record.totalAmount)}</TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={record.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Link href={`/payslip/${record._id}`}>
                            335                               <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log("Email", record._id)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Email
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log("Print", record._id)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log("Download", record._id)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedPayslips.length} of {filteredPayroll.length} payslips selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchDownload}
              disabled={selectedPayslips.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBatchPrint}
              disabled={selectedPayslips.length === 0}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleBatchEmail}
              disabled={selectedPayslips.length === 0}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}