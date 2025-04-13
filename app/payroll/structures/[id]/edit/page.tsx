import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PayrollStructureForm } from "@/components/payroll-structure-form"

export default function EditPayrollStructurePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/payroll/structures">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Payroll Structure</h1>
        </div>
      </div>
      <PayrollStructureForm id={params.id} />
    </div>
  )
}
