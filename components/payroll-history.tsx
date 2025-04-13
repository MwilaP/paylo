"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, FileText } from "lucide-react"
import { useDatabase } from "@/lib/db/db-context"

export function PayrollHistory() {
  const router = useRouter()
  const { payrollHistoryService, isLoading } = useDatabase()
  const [payrollHistory, setPayrollHistory] = useState<any[]>([])

  useEffect(() => {
    const loadPayrollHistory = async () => {
      if (!payrollHistoryService) return

      try {
        const data = await payrollHistoryService.getAllPayrollRecords()
        // Sort by date (newest first)
        const sorted = [...data].sort((a, b) => {
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        })

        setPayrollHistory(sorted)
      } catch (error) {
        console.error("Error loading payroll history:", error)
        setPayrollHistory([])
      }
    }

    loadPayrollHistory()
  }, [payrollHistoryService])

  const handleGeneratePayroll = () => {
    router.push("/payroll/generate")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <FileText className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No payroll history</h3>
      <p className="text-sm text-muted-foreground mt-2 mb-4">Generate your first payroll to see history</p>
      <Button onClick={handleGeneratePayroll} size="sm">
        <DollarSign className="mr-2 h-4 w-4" />
        Generate Payroll
      </Button>
    </div>
  )

  // Loading state component
  const LoadingState = () => (
    <div className="flex justify-center py-8">
      <div className="animate-pulse space-y-4 w-full">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  )

  return (
    <Card>
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : payrollHistory.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollHistory.map((payroll) => (
                  <TableRow key={payroll._id}>
                    <TableCell className="font-medium">{payroll.period || "Monthly Payroll"}</TableCell>
                    <TableCell>{payroll.date ? new Date(payroll.date).toLocaleDateString() : "—"}</TableCell>
                    <TableCell>{payroll.employeeCount || 0}</TableCell>
                    <TableCell>${payroll.totalAmount?.toLocaleString() || "0"}</TableCell>
                    <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/payroll/history/${payroll._id}`)}>
                        View
                      </Button>
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
