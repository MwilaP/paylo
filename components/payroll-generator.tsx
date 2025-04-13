"use client"

import Link from "next/link"

import { useState } from "react"
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

export function PayrollGenerator() {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date>(new Date())
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const employees = [
    {
      id: "1",
      name: "Robert Johnson",
      department: "Engineering",
      position: "Software Engineer",
      baseSalary: 85000,
      allowances: 15000,
      deductions: 23250,
      netSalary: 76750,
    },
    {
      id: "2",
      name: "Sarah Williams",
      department: "Marketing",
      position: "Marketing Specialist",
      baseSalary: 75000,
      allowances: 12000,
      deductions: 19500,
      netSalary: 67500,
    },
    {
      id: "3",
      name: "Michael Brown",
      department: "Finance",
      position: "Financial Analyst",
      baseSalary: 80000,
      allowances: 13000,
      deductions: 21000,
      netSalary: 72000,
    },
    {
      id: "4",
      name: "Emily Davis",
      department: "Human Resources",
      position: "HR Coordinator",
      baseSalary: 70000,
      allowances: 10000,
      deductions: 18000,
      netSalary: 62000,
    },
    {
      id: "5",
      name: "David Wilson",
      department: "Product",
      position: "Product Manager",
      baseSalary: 95000,
      allowances: 18000,
      deductions: 25500,
      netSalary: 87500,
    },
  ]

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(employees.map((employee) => employee.id))
    }
  }

  const handleSelectEmployee = (id: string) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((employeeId) => employeeId !== id))
    } else {
      setSelectedEmployees([...selectedEmployees, id])
    }
  }

  const handleGeneratePayroll = () => {
    toast({
      title: "Payroll generated successfully",
      description: `Payroll for ${format(date, "MMMM yyyy")} has been generated for ${selectedEmployees.length} employees.`,
    })
    router.push("/payroll")
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
                      checked={selectedEmployees.length === employees.length}
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
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={() => handleSelectEmployee(employee.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell className="text-right">${employee.baseSalary.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {selectedEmployees.length} of {employees.length} employees selected
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
                {employees
                  .filter((employee) => selectedEmployees.includes(employee.id))
                  .map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell className="text-right">
                        ${(employee.baseSalary / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        ${(employee.allowances / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        ${(employee.deductions / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        ${(employee.netSalary / 12).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow className="bg-muted/50 font-medium">
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-right">
                    $
                    {employees
                      .filter((employee) => selectedEmployees.includes(employee.id))
                      .reduce((sum, employee) => sum + employee.baseSalary / 12, 0)
                      .toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    $
                    {employees
                      .filter((employee) => selectedEmployees.includes(employee.id))
                      .reduce((sum, employee) => sum + employee.allowances / 12, 0)
                      .toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    $
                    {employees
                      .filter((employee) => selectedEmployees.includes(employee.id))
                      .reduce((sum, employee) => sum + employee.deductions / 12, 0)
                      .toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    $
                    {employees
                      .filter((employee) => selectedEmployees.includes(employee.id))
                      .reduce((sum, employee) => sum + employee.netSalary / 12, 0)
                      .toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
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
