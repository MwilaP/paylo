"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { LeaveRequestsList } from "@/components/leave-requests-list"
import { LeaveRequestFilters } from "@/components/leave-request-filters"
import { LeaveRequestForm } from "@/components/leave-request-form"
import { leaveRequestService } from "@/lib/db/services/leave-request.service"
import { getEmployeeService } from "@/lib/db/services/service-factory"
import type { LeaveRequest } from "@/lib/db/models/leave-request.model"

export default function LeavePage() {
  const { toast } = useToast()
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [employee, setEmployee] = useState<{
    _id: string
    firstName: string
    lastName: string
    hireDate: string
  } | null>(null)
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const service = await getEmployeeService()
        const currentUser = await service.getCurrentUser()
        setEmployee(currentUser)
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    }
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const service = await leaveRequestService
        const requests = await service.getAll()
        setLeaveRequests(requests)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading leave requests",
          description: error instanceof Error ? error.message : "An unknown error occurred",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveRequests()
  }, [])

  const handleSubmit = async (formData: {
    employeeName: string;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    reason?: string;
  }) => {
    try {
      // Get employee ID from name
      const empService = await getEmployeeService()
      const allEmployees = await empService.getAllEmployees()
      const employees = allEmployees.filter((emp: {
        _id: string;
        firstName?: string;
        lastName?: string;
        [key: string]: any;
      }) =>
        emp.firstName?.toLowerCase().includes(formData.employeeName.toLowerCase()) ||
        emp.lastName?.toLowerCase().includes(formData.employeeName.toLowerCase()) ||
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(formData.employeeName.toLowerCase())
      )
      if (!employees.length) {
        throw new Error("Employee not found")
      }

      const service = await leaveRequestService
      const newRequest = await service.create({
        employeeId: employees[0]._id,
        employeeName: formData.employeeName,
        leaveType: formData.leaveType as LeaveRequest['leaveType'],
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        reason: formData.reason || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      setLeaveRequests([newRequest, ...leaveRequests])
      setShowForm(false)
      toast({
        title: "Leave request submitted",
        description: "Your request has been received.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error submitting leave request",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground">Manage employee leave requests</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "View Requests" : "New Leave Request"}
          </Button>
        </div>
      </div>

      {showForm ? (
        <div className="rounded-lg border p-6">
          {employee ? (
            <LeaveRequestForm
              employee={{
                id: employee._id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                hireDate: employee.hireDate
              }}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <div className="text-center py-8">
              <p>Loading employee data...</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <LeaveRequestFilters />
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <LeaveRequestsList leaveRequests={leaveRequests} />
          )}
        </>
      )}
    </div>
  )
}