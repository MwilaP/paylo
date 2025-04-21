"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import {
    ArrowLeft,
    Download,
    Mail,
    Printer,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    DollarSign,
    Loader2
} from "lucide-react"
import { getPayrollHistoryService } from "@/lib/db/services/service-factory"
import { useToast } from "@/hooks/use-toast"

export default function PayrollDetails() {
    const router = useRouter()
    const { id } = useParams()
    const { toast } = useToast()

    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const [payrollData, setPayrollData] = useState(null)
    const [payrollHistoryService, setPayrollHistoryService] = useState(null)
    const [error, setError] = useState(null)

    // Dialog states
    const [showProcessDialog, setShowProcessDialog] = useState(false)
    const [showCompleteDialog, setShowCompleteDialog] = useState(false)
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [cancelNotes, setCancelNotes] = useState("")

    useEffect(() => {
        const initializeService = async () => {
            try {
                const service = await getPayrollHistoryService()
                setPayrollHistoryService(service)
            } catch (error) {
                console.error("Error initializing payroll service:", error)
                setError("Failed to initialize payroll service")
                toast({
                    title: "Error",
                    description: "Failed to load payroll services",
                    variant: "destructive",
                })
            }
        }

        initializeService()
    }, [toast])

    useEffect(() => {
        const fetchPayrollDetails = async () => {
            if (!payrollHistoryService || !id) return

            setIsLoading(true)
            try {
                const data = await payrollHistoryService.getPayrollRecordById(id)
                setPayrollData(data)
            } catch (error) {
                console.error("Error fetching payroll details:", error)
                setError("Failed to load payroll details")
                toast({
                    title: "Error",
                    description: "Failed to load payroll details",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchPayrollDetails()
    }, [payrollHistoryService, id, toast])

    // Process payroll function
    const handleProcessPayroll = async () => {
        if (!payrollHistoryService || !id) return

        setIsProcessing(true)
        try {
            // Get current user (this will depend on your auth setup)
            const processedBy = "Current User" // Replace with actual user info

            const updatedPayroll = await payrollHistoryService.processPayroll(id, processedBy)
            setPayrollData(updatedPayroll)

            toast({
                title: "Payroll Processing Started",
                description: "The payroll is now being processed.",
                variant: "default",
            })
        } catch (error) {
            console.error("Error processing payroll:", error)
            toast({
                title: "Processing Failed",
                description: error.message || "Failed to process payroll",
                variant: "destructive",
            })
        } finally {
            setIsProcessing(false)
            setShowProcessDialog(false)
        }
    }

    // Complete payroll function
    const handleCompletePayroll = async () => {
        if (!payrollHistoryService || !id) return

        setIsProcessing(true)
        try {
            const updatedPayroll = await payrollHistoryService.completePayroll(id)
            setPayrollData(updatedPayroll)

            toast({
                title: "Payroll Completed",
                description: "The payroll has been marked as completed.",
                variant: "default",
            })
        } catch (error) {
            console.error("Error completing payroll:", error)
            toast({
                title: "Completion Failed",
                description: error.message || "Failed to complete payroll",
                variant: "destructive",
            })
        } finally {
            setIsProcessing(false)
            setShowCompleteDialog(false)
        }
    }

    // Cancel payroll function
    const handleCancelPayroll = async () => {
        if (!payrollHistoryService || !id) return

        setIsProcessing(true)
        try {
            const updatedPayroll = await payrollHistoryService.cancelPayroll(id, cancelNotes)
            setPayrollData(updatedPayroll)

            toast({
                title: "Payroll Cancelled",
                description: "The payroll has been cancelled.",
                variant: "default",
            })
        } catch (error) {
            console.error("Error cancelling payroll:", error)
            toast({
                title: "Cancellation Failed",
                description: error.message || "Failed to cancel payroll",
                variant: "destructive",
            })
        } finally {
            setIsProcessing(false)
            setShowCancelDialog(false)
            setCancelNotes("")
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" /> Completed
                </Badge>
            case "processing":
                return <Badge className="bg-blue-500">
                    <Clock className="mr-1 h-3 w-3" /> Processing
                </Badge>
            case "draft":
                return <Badge variant="outline">
                    <AlertCircle className="mr-1 h-3 w-3" /> Draft
                </Badge>
            case "cancelled":
                return <Badge variant="destructive">
                    <XCircle className="mr-1 h-3 w-3" /> Cancelled
                </Badge>
            default:
                return <Badge variant="secondary">Unknown</Badge>
        }
    }

    const formatCurrency = (amount) => {
        return `K${(amount || 0).toLocaleString()}`
    }

    // Calculate total salary components
    const calculatePayrollTotals = (items) => {
        if (!items || !items.length) return {
            totalBasic: 0,
            totalAllowances: 0,
            totalDeductions: 0,
            totalNet: 0
        }

        return items.reduce((acc, item) => {
            return {
                totalBasic: acc.totalBasic + (item.basicSalary || 0),
                totalAllowances: acc.totalAllowances + (item.allowances || 0),
                totalDeductions: acc.totalDeductions + (item.deductions || 0),
                totalNet: acc.totalNet + (item.netSalary || 0)
            }
        }, {
            totalBasic: 0,
            totalAllowances: 0,
            totalDeductions: 0,
            totalNet: 0
        })
    }

    // Empty state component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium">Payroll not found</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">The requested payroll record does not exist or was deleted</p>
            <Button onClick={() => router.push("/payroll/history")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Payroll History
            </Button>
        </div>
    )

    // Loading state component
    const LoadingState = () => (
        <div className="flex justify-center py-12">
            <div className="animate-pulse space-y-4 w-full">
                <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
            </div>
        </div>
    )

    if (isLoading) return <LoadingState />
    if (!payrollData) return <EmptyState />

    const { totalBasic, totalAllowances, totalDeductions, totalNet } = calculatePayrollTotals(payrollData.items)
    const payrollId = payrollData.id?.substring(0, 8) || payrollData._id?.substring(0, 8) || "Unknown"

    return (
        <div className="space-y-6">
            {/* Top navigation bar */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/payroll")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Payroll History
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button variant="outline" size="sm">
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                </div>
            </div>

            {/* Process Dialog */}
            <AlertDialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Process Payroll</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you ready to process this payroll? This will change its status from draft to processing.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleProcessPayroll}
                            disabled={isProcessing}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Process Payroll
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Complete Dialog */}
            <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Complete Payroll</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will finalize the payroll and mark it as completed. Are you sure all payments have been processed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCompletePayroll}
                            disabled={isProcessing}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Completing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Complete Payroll
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel Dialog */}
            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Payroll</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will cancel the payroll. Please provide a reason for cancellation.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="Reason for cancellation"
                            value={cancelNotes}
                            onChange={(e) => setCancelNotes(e.target.value)}
                            className="min-h-24"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Back</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelPayroll}
                            disabled={isProcessing || !cancelNotes.trim()}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Cancelling...
                                </>
                            ) : (
                                <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel Payroll
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Payroll Summary Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Payroll #{payrollId}</CardTitle>
                            <CardDescription>
                                {payrollData.period || "Monthly Payroll"} •
                                Payment Date: {payrollData.paymentDate ? new Date(payrollData.paymentDate).toLocaleDateString() : "Not set"}
                            </CardDescription>
                        </div>
                        {getStatusBadge(payrollData.status)}
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total Employees</p>
                            <p className="text-2xl font-bold">{payrollData.employeeCount || payrollData.items?.length || 0}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total Gross</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalBasic + totalAllowances)}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Total Net Payment</p>
                            <p className="text-2xl font-bold">{formatCurrency(payrollData.totalAmount || totalNet)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs for different views */}
            <Tabs defaultValue="employees">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="employees">Employee Details</TabsTrigger>
                    <TabsTrigger value="summary">Payment Summary</TabsTrigger>
                </TabsList>

                {/* Employee Details Tab */}
                <TabsContent value="employees" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Employee Payments</CardTitle>
                            <CardDescription>Details of payments made to each employee</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Employee</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Basic Salary</TableHead>
                                            <TableHead>Allowances</TableHead>
                                            <TableHead>Deductions</TableHead>
                                            <TableHead>Net Salary</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(payrollData.items || []).map((item, index) => (
                                            <TableRow key={item.employeeId || index}>
                                                <TableCell className="font-medium">{item.employeeName || "Unknown"}</TableCell>
                                                <TableCell>{item.department || "N/A"}</TableCell>
                                                <TableCell>{formatCurrency(item.basicSalary)}</TableCell>
                                                <TableCell>{formatCurrency(item.allowances)}</TableCell>
                                                <TableCell>{formatCurrency(item.deductions)}</TableCell>
                                                <TableCell className="font-medium">{formatCurrency(item.netSalary)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={payrollData.status === "draft"}
                                                    >
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        Payslip
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Payment Summary Tab */}
                <TabsContent value="summary" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Summary</CardTitle>
                            <CardDescription>Overview of the payroll payment distribution</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Salary Breakdown</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Basic Salary</span>
                                                    <span>{formatCurrency(totalBasic)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Allowances</span>
                                                    <span>{formatCurrency(totalAllowances)}</span>
                                                </div>
                                                <Separator className="my-2" />
                                                <div className="flex justify-between font-medium">
                                                    <span>Total Gross</span>
                                                    <span>{formatCurrency(totalBasic + totalAllowances)}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Deductions Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Total Deductions</span>
                                                    <span>{formatCurrency(totalDeductions)}</span>
                                                </div>
                                                <Separator className="my-2" />
                                                <div className="flex justify-between font-medium">
                                                    <span>Total Net Payment</span>
                                                    <span>{formatCurrency(totalNet)}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">Payroll Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Created Date</p>
                                                <p className="font-medium">{payrollData.createdAt ? new Date(payrollData.createdAt).toLocaleDateString() : "Unknown"}</p>

                                                <p className="text-sm text-muted-foreground mt-4">Last Updated</p>
                                                <p className="font-medium">{payrollData.updatedAt ? new Date(payrollData.updatedAt).toLocaleDateString() : "Unknown"}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-muted-foreground">Processed By</p>
                                                <p className="font-medium">{payrollData.processedBy || "Not processed yet"}</p>

                                                <p className="text-sm text-muted-foreground mt-4">Notes</p>
                                                <p className="font-medium">{payrollData.notes || "No notes available"}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {payrollData.payrollStructureId && (
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">Payroll Structure</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">
                                                This payroll was generated using payroll structure ID: <span className="font-mono">{payrollData.payrollStructureId}</span>
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Footer Actions */}
            <Card>
                <CardFooter className="flex justify-between py-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Created on {payrollData.createdAt ? new Date(payrollData.createdAt).toLocaleString() : "Unknown date"}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {payrollData.status === "draft" && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowCancelDialog(true)}
                                    disabled={isProcessing}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => setShowProcessDialog(true)}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            Process Payroll
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                        {payrollData.status === "processing" && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowCancelDialog(true)}
                                    disabled={isProcessing}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => setShowCompleteDialog(true)}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Completing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Complete Payroll
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                        {payrollData.status === "completed" && (
                            <Button variant="outline" size="sm">
                                <FileText className="mr-2 h-4 w-4" />
                                View Payroll Report
                            </Button>
                        )}
                        {payrollData.status === "cancelled" && (
                            <Badge variant="destructive">This payroll has been cancelled</Badge>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}