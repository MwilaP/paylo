import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PayrollStructuresList } from "@/components/payroll-structures-list"

export default function PayrollStructuresPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Structures</h1>
          <p className="text-muted-foreground">Create and manage payroll structures for your employees</p>
        </div>
        <Button asChild>
          <Link href="/payroll/structures/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Structure
          </Link>
        </Button>
      </div>
      <PayrollStructuresList />
    </div>
  )
}
