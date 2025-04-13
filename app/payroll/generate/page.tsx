import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PayrollGenerator } from "@/components/payroll-generator"

export default function GeneratePayrollPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/payroll">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Generate Payroll</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payroll Generation</CardTitle>
          <CardDescription>
            Generate payroll for a specific period. Review and confirm employee salaries before processing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PayrollGenerator />
        </CardContent>
      </Card>
    </div>
  )
}
