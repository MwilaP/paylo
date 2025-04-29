"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getEmployeeService } from "@/lib/db/services/service-factory"
import {
  calculateLeaveBalance,
  calculateLeaveTaken,
  calculateAvailableLeave
} from "@/lib/utils/leave-calculations"
import { Download, Mail, Printer, ArrowLeft, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LeaveRequestForm } from "@/components/leave-request-form"

interface LeaveHistory {
  id: string
  date: string
  days: number
  type: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export default function EmployeeLeaveManagement({ id }: { id: string }) {
    const [employee, setEmployee] = useState<any>(null)
    const [leaveHistory, setLeaveHistory] = useState<LeaveHistory[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()
    const router = useRouter()
    const [showRequestForm, setShowRequestForm] = useState(false)

    const handleLeaveRequestSuccess = (newLeave: LeaveHistory) => {
      setLeaveHistory([newLeave, ...leaveHistory])
      setShowRequestForm(false)
      toast({
        title: "Success",
        description: "Leave request submitted",
      })
    }

    const handleCancelLeave = async (leaveId: string) => {
      try {
        const service = await getEmployeeService()
        await service.cancelLeaveRequest(leaveId)
        setLeaveHistory(leaveHistory.filter(leave => leave.id !== leaveId))
        toast({
          title: "Success",
          description: "Leave request cancelled",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to cancel leave request",
          variant: "destructive"
        })
      }
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                console.log(id)
                const service = await getEmployeeService()
                const employeeData = await service.getEmployeeById(id)
                // const history = await service.getLeaveHistory(id)
                setEmployee(employeeData)
                // setLeaveHistory(history)
            } catch (error) {
                console.log('error', error)
                toast({
                    title: "Error",
                    description: "Failed to load leave data",
                    variant: "destructive"
                })
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [id, toast])

    if (isLoading) return <div>Loading...</div>
    if (!employee) return <div>Employee not found</div>

    const remainingLeave = calculateLeaveBalance(employee.hireDate)

    return (
        <div className="container mx-auto py-6 space-y-8">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>Leave Management: {employee?.firstName} {employee.lastName}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium">Remaining Leave</h3>
                                <p className="text-2xl font-bold">{remainingLeave} days</p>

                            </div>
                            <div className="border rounded-lg p-4">
                                <h3 className="font-medium">Start Date</h3>
                                <p>{new Date(employee.hireDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Leave History</h3>
                            <Button onClick={() => setShowRequestForm(true)}>
                              Request Leave
                            </Button>
                          </div>
              
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Days</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {leaveHistory.map((leave) => (
                                  <TableRow key={leave.date}>
                                    <TableCell>{new Date(leave.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{leave.type}</TableCell>
                                    <TableCell>{leave.days}</TableCell>
                                    <TableCell>
                                      <Badge variant={leave.status === 'Approved' ? 'default' : 'secondary'}>
                                        {leave.status}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      {leave.status === 'Pending' && (
                                        <Button variant="ghost" size="sm" onClick={() => handleCancelLeave(leave.id)}>
                                          Cancel
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
              
                        {showRequestForm && (
                          <LeaveRequestForm
                            employee={employee}
                            onSuccess={handleLeaveRequestSuccess}
                            onCancel={() => setShowRequestForm(false)}
                          />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}