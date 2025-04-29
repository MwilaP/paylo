import EmployeeLeaveManagement from "@/components/employee-leave-management"

export default function Page({ params }: { params: { id: string } }) {
  return <EmployeeLeaveManagement id={params.id} />
}