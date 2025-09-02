"use client"

import Link from "next/link"
import { v4 as uuidv4 } from "uuid"
import { useState, useEffect } from "react"
import {
  fetchPayrollStructures,
  fetchAllEmployees,
  fetchEmployeesByStructure,
  savePayrollHistory
} from "@/lib/db/services/service-factory"
import type { PayrollHistory } from "@/lib/db/models/payroll-history.model"
import { useRouter } from "next/navigation"
import { CalendarIcon, CreditCard, Download, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { calculateNetSalary } from "@/lib/utils/payroll-calculations"

export function PayrollGenerator() {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date>(new Date())
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [employeeData, setEmployeeData] = useState<Array<any>>([])
  const [payrollStructures, setPayrollStructures] = useState<Array<any>>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Fetch payroll structures on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Fetch both employees and payroll structures
        const [employees, structures] = await Promise.all([
          fetchAllEmployees(),
          fetchPayrollStructures()
        ])

        // Enhance structures with calculated net salary
        const enhancedStructures = structures.map(structure => ({
          ...structure,
          calculatedNetSalary: ((structure.basicSalary || 0) +
            (Array.isArray(structure.allowances) ? structure.allowances.reduce((sum: number, a: any) => sum + (a.value || 0), 0) : 0) -
            (Array.isArray(structure.deductions) ? structure.deductions.reduce((sum: number, d: any) => sum + (d.value || 0), 0) : 0))
        }))

        // Create a map of payroll structures by ID for quick lookup
        const structuresMap = enhancedStructures.reduce((map: Record<string, any>, structure: any) => {
          map[structure._id] = structure
          return map
        }, {})

        // Enhance employees with payroll structure data
        const enhancedEmployees = employees.map((employee: any) => {
          const structure = employee.payrollStructureId ? structuresMap[employee.payrollStructureId] : null



          // Calculate salary details based on the employee's payroll structure
          const basicSalary = structure?.basicSalary || 0

          const cal = () => {
            if (!structure) {
              return
            }
            const salaryStuctures = calculateNetSalary(basicSalary, structure.allowances, structure.deductions)
            return salaryStuctures
          }

          const employeesStructures = cal()

          console.log("CALCULATOR", employeesStructures)

          const allowancesTotal = employeesStructures ? employeesStructures?.totalAllowances : 0
          const deductionsTotal = employeesStructures ? employeesStructures?.totalDeductions : 0
          const netSalary = employeesStructures ? employeesStructures?.netSalary : 0

          return {
            ...employee,
            payrollStructure: structure,
            baseSalary: basicSalary,
            allowances: allowancesTotal,
            deductions: deductionsTotal,
            netSalary: netSalary
          }
        })

        setEmployeeData(enhancedEmployees)
        setPayrollStructures(enhancedStructures)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast({
          title: "Error loading data",
          description: "Failed to load employees and payroll structures. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [toast])

  // Use employee data from SQLite or fallback to dummy data if loading
  const displayEmployees = isLoading ? [
    {
      _id: "loading",
      firstName: "Loading",
      lastName: "...",
      department: "...",
      designation: "...",
      baseSalary: 0,
      allowances: 0,
      deductions: 0,
      netSalary: 0,
    }
  ] : employeeData.length === 0 ? [
    {
      _id: "no-data",
      firstName: "No",
      lastName: "employees found",
      department: "-",
      designation: "-",
      baseSalary: 0,
      allowances: 0,
      deductions: 0,
      netSalary: 0,
    }
  ] : employeeData

  // Reset selected employees when employee data changes
  useEffect(() => {
    setSelectedEmployees([])
  }, [employeeData])

  const handleSelectAll = () => {
    if (selectedEmployees.length === displayEmployees.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(displayEmployees.map((employee) => employee._id))
    }
  }

  const handleSelectEmployee = (id: string) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((employeeId) => employeeId !== id))
    } else {
      setSelectedEmployees([...selectedEmployees, id])
    }
  }

  const handleGeneratePayroll = async () => {
    try {
      // Get selected employees
      const selectedEmployeeData = displayEmployees.filter(employee =>
        selectedEmployees.includes(employee._id)
      )

      // Create payroll items from selected employees
      const payrollItems = selectedEmployeeData.map(employee => ({
        employeeId: employee._id,
        employeeName: `${employee.firstName || ''} ${employee.lastName || ''}`,
        department: employee.department || 'General',
        basicSalary: employee.baseSalary || 0,
        allowances: employee.allowances || 0,
        deductions: employee.deductions || 0,
        netSalary: employee.netSalary || 0,
        payrollStructureId: employee.payrollStructureId || ''
      }))

      // Calculate total amount as the sum of all net salaries
      const totalAmount = payrollItems.reduce((sum, item) => sum + item.netSalary, 0)

      // Create a single payroll record with all employee items
      const payrollRecord: PayrollHistory = {
        _id: `payroll_${uuidv4()}`,
        status: 'draft' as const,
        date: format(date, 'yyyy-MM-dd'),
        paymentDate: format(date, 'yyyy-MM-dd'),
        period: format(date, 'MMMM yyyy'),
        totalAmount,
        employeeCount: payrollItems.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: payrollItems
      }

      const payrollRecords = [payrollRecord]

      // Save payroll records to database
      await savePayrollHistory(payrollRecords)

      toast({
        title: "Payroll generated successfully",
        description: `Payroll for ${format(date, "MMMM yyyy")} has been generated for ${selectedEmployees.length} employees.`,
      })

      router.push("/payroll")
    } catch (error) {
      console.error("Error generating payroll:", error)
      toast({
        title: "Error generating payroll",
        description: "Failed to save payroll records. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="payroll-period">Payroll Period</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="payroll-period"
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "MMMM yyyy") : <span>Select period</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-date">Payment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="payment-date"
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "MMMM dd, yyyy") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="department-filter">Department</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="department-filter">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active Employees</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="all">All Statuses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="search-employees">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="search-employees" placeholder="Search employees..." className="pl-8" />
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedEmployees.length === displayEmployees.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right">Base Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">Loading payroll structures...</TableCell>
                  </TableRow>
                ) : payrollStructures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">No payroll structures found</TableCell>
                  </TableRow>
                ) : (
                  displayEmployees.map((employee) => (
                    <TableRow key={employee._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEmployees.includes(employee._id)}
                          onCheckedChange={() => handleSelectEmployee(employee._id)}
                          disabled={employee._id === "loading" || employee._id === "no-data"}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{`${employee.firstName || ''} ${employee.lastName || ''}`}</TableCell>
                      <TableCell>{employee.department || ''}</TableCell>
                      <TableCell>{employee.designation || ''}</TableCell>
                      <TableCell className="text-right">K{(employee.baseSalary || 0).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedEmployees.length} of {displayEmployees.length} employees selected
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/payroll">Cancel</Link>
              </Button>
              <Button onClick={() => setStep(2)} disabled={selectedEmployees.length === 0}>
                Next: Review
              </Button>
            </div>
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="rounded-md border">
            <div className="p-4 bg-muted/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">Payroll Review</h3>
                  <p className="text-sm text-muted-foreground">
                    Period: {format(date, "MMMM yyyy")} | Payment Date: {format(date, "MMMM dd, yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Base Salary</TableHead>
                  <TableHead className="text-right">Allowances</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">Loading payroll data...</TableCell>
                  </TableRow>
                ) : selectedEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">No employees selected</TableCell>
                  </TableRow>
                ) : (
                  displayEmployees
                    .filter((employee) => selectedEmployees.includes(employee._id))
                    .map((employee) => (
                      <TableRow key={employee._id}>
                        <TableCell className="font-medium">{`${employee.firstName || ''} ${employee.lastName || ''}`}</TableCell>
                        <TableCell>{employee.department || ''}</TableCell>
                        <TableCell className="text-right">
                          K{(employee.baseSalary || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          K{(employee.allowances || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          K{(employee.deductions || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          K{(employee.netSalary || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))
                )}
                {selectedEmployees.length > 0 && (
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell className="text-right">
                      K
                      {displayEmployees
                        .filter((employee) => selectedEmployees.includes(employee._id))
                        .reduce((sum: number, employee) => sum + (employee.baseSalary || 0), 0)
                        .toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      K
                      {displayEmployees
                        .filter((employee) => selectedEmployees.includes(employee._id))
                        .reduce((sum: number, employee) => sum + (employee.allowances || 0), 0)
                        .toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      K
                      {displayEmployees
                        .filter((employee) => selectedEmployees.includes(employee._id))
                        .reduce((sum: number, employee) => sum + (employee.deductions || 0), 0)
                        .toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      K
                      {displayEmployees
                        .filter((employee) => selectedEmployees.includes(employee._id))
                        .reduce((sum: number, employee) => sum + (employee.netSalary || 0), 0)
                        .toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="email-payslips" />
              <Label htmlFor="email-payslips">Email payslips to employees</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="mark-as-paid" />
              <Label htmlFor="mark-as-paid">Mark as paid immediately</Label>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/payroll">Cancel</Link>
              </Button>
              <Button onClick={handleGeneratePayroll}>
                <CreditCard className="mr-2 h-4 w-4" />
                Generate Payroll
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
