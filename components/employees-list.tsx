"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Plus, UserPlus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EmployeeFilters } from "./employee-filters"
import { useDatabase } from "@/lib/db/db-context"

export function EmployeesList() {
  const router = useRouter()
  const { employeeService, isLoading } = useDatabase()
  const [employees, setEmployees] = useState<any[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([])
  const [filters, setFilters] = useState({
    department: "all",
    status: "all",
    search: "",
  })

  useEffect(() => {
    const loadEmployees = async () => {
      if (!employeeService) return

      try {
        const data = await employeeService.getAllEmployees()
        setEmployees(data)
        setFilteredEmployees(data)
      } catch (error) {
        console.error("Error loading employees:", error)
        setEmployees([])
        setFilteredEmployees([])
      }
    }

    loadEmployees()
  }, [employeeService])

  useEffect(() => {
    if (!employees.length) {
      setFilteredEmployees([])
      return
    }

    let result = [...employees]

    // Apply department filter
    if (filters.department !== "all") {
      result = result.filter((employee) => employee.department === filters.department)
    }

    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter((employee) => employee.status === filters.status)
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (employee) =>
          `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchLower) ||
          employee.email?.toLowerCase().includes(searchLower) ||
          employee.designation?.toLowerCase().includes(searchLower),
      )
    }

    setFilteredEmployees(result)
  }, [employees, filters])

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters })
  }

  const handleViewEmployee = (id: string) => {
    router.push(`/employees/${id}`)
  }

  const handleEditEmployee = (id: string) => {
    router.push(`/employees/${id}/edit`)
  }

  const handleAddEmployee = () => {
    router.push("/employees/new")
  }

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-4">
        <UserPlus className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-lg font-medium">No employees found</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md">
        Get started by creating your first employee record. You can add details like personal information, job details,
        and salary structure.
      </p>
      <Button onClick={handleAddEmployee}>
        <Plus className="mr-2 h-4 w-4" />
        Add New Employee
      </Button>
    </div>
  )

  // Loading state component
  const LoadingState = () => (
    <div className="flex justify-center py-12">
      <div className="animate-pulse space-y-4 w-full">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Employees</CardTitle>
          <CardDescription>Manage your employee records</CardDescription>
        </div>
        <Button onClick={handleAddEmployee}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </CardHeader>
      <CardContent>
        <EmployeeFilters onFilterChange={handleFilterChange} />

        {isLoading ? (
          <LoadingState />
        ) : employees.length === 0 ? (
          <EmptyState />
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No employees match your filters</p>
          </div>
        ) : (
          <div className="rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&text=${employee.firstName?.charAt(0) || "?"}`}
                          />
                          <AvatarFallback>
                            {employee.firstName?.charAt(0) || "?"}
                            {employee.lastName?.charAt(0) || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{`${employee.firstName || ""} ${employee.lastName || ""}`}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department || "—"}</TableCell>
                    <TableCell>{employee.designation || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                        {employee.status || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewEmployee(employee._id)}>
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditEmployee(employee._id)}>Edit</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
