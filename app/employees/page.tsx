import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { EmployeesList } from "@/components/employees-list"
import { EmployeeFilters } from "@/components/employee-filters"

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      {/* <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage your employees and their information</p>
        </div>
        <Button asChild>
          <Link href="/employees/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div> */}
      {/* <EmployeeFilters /> */}
      <EmployeesList />
    </div>
  )
}
