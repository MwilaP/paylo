"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Search, FileText } from "lucide-react"
import { AssignStructureModal } from "./assign-structure-modal"
import { useDatabase } from "@/lib/db/db-context"

export function PayrollStructuresList() {
  const router = useRouter()
  const { payrollStructureService, isLoading } = useDatabase()
  const [structures, setStructures] = useState<any[]>([])
  const [filteredStructures, setFilteredStructures] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedStructure, setSelectedStructure] = useState<any>(null)

  useEffect(() => {
    const loadStructures = async () => {
      if (!payrollStructureService) return

      try {
        const data = await payrollStructureService.getAllPayrollStructures()
        setStructures(data)
        setFilteredStructures(data)
      } catch (error) {
        console.error("Error loading payroll structures:", error)
        setStructures([])
        setFilteredStructures([])
      }
    }

    loadStructures()
  }, [payrollStructureService])

  useEffect(() => {
    if (!structures.length) {
      setFilteredStructures([])
      return
    }

    if (!searchQuery.trim()) {
      setFilteredStructures(structures)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = structures.filter(
      (structure) =>
        structure.name.toLowerCase().includes(query) || structure.description?.toLowerCase().includes(query),
    )
    setFilteredStructures(filtered)
  }, [structures, searchQuery])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCreateStructure = () => {
    router.push("/payroll/structures/new")
  }

  const handleEditStructure = (id: string) => {
    router.push(`/payroll/structures/${id}/edit`)
  }

  const handleAssignStructure = (structure: any) => {
    setSelectedStructure(structure)
    setAssignModalOpen(true)
  }

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-primary/10 p-6 mb-4">
        <FileText className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-lg font-medium">No payroll structures found</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-md">
        Create your first payroll structure to define how employee salaries are calculated, including basic salary,
        allowances, and deductions.
      </p>
      <Button onClick={handleCreateStructure}>
        <Plus className="mr-2 h-4 w-4" />
        Create Payroll Structure
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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payroll Structures</CardTitle>
            <CardDescription>Manage your organization's payroll structures</CardDescription>
          </div>
          <Button onClick={handleCreateStructure}>
            <Plus className="mr-2 h-4 w-4" />
            Create Structure
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState />
          ) : structures.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search structures..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              {filteredStructures.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No structures match your search</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Basic Salary</TableHead>
                        <TableHead>Allowances</TableHead>
                        <TableHead>Deductions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStructures.map((structure) => (
                        <TableRow key={structure._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{structure.name}</div>
                              {structure.description && (
                                <div className="text-sm text-muted-foreground">{structure.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {structure.frequency || "Monthly"}
                            </Badge>
                          </TableCell>
                          <TableCell>${structure.basicSalary?.toLocaleString() || "0"}</TableCell>
                          <TableCell>{structure.allowances?.length || 0}</TableCell>
                          <TableCell>{structure.deductions?.length || 0}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditStructure(structure._id)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAssignStructure(structure)}>
                                  Assign to Employees
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {selectedStructure && (
        <AssignStructureModal open={assignModalOpen} onOpenChange={setAssignModalOpen} structure={selectedStructure} />
      )}
    </>
  )
}
