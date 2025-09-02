import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EmployeeDetailProps {
  employeeId: string
}

export function EmployeeDetail({ employeeId }: EmployeeDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Details</CardTitle>
        <CardDescription>Employee ID: {employeeId}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Employee details will be loaded here.</p>
      </CardContent>
    </Card>
  )
}
