import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Mail } from "lucide-react"

export function EmployeePayslips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payslips</CardTitle>
        <CardDescription>View and download employee payslips</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Gross Pay</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Pay</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>April 2025</TableCell>
              <TableCell>Apr 30, 2025</TableCell>
              <TableCell>$7,083.33</TableCell>
              <TableCell>$1,937.50</TableCell>
              <TableCell>$5,145.83</TableCell>
              <TableCell>
                <Badge>Paid</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>March 2025</TableCell>
              <TableCell>Mar 31, 2025</TableCell>
              <TableCell>$7,083.33</TableCell>
              <TableCell>$1,937.50</TableCell>
              <TableCell>$5,145.83</TableCell>
              <TableCell>
                <Badge>Paid</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
