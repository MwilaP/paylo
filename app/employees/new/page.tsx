import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployeeForm } from "@/components/employee-form"

export default function NewEmployeePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/employees">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Employee</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>
            Enter the details of the new employee. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeForm />
        </CardContent>
      </Card>
    </div>
  )
}
