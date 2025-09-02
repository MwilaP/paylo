import { Routes, Route, Navigate } from "react-router-dom"
import { PayrollGenerate } from "@/components/payroll-generate"
import { PayrollStructures } from "@/components/payroll-structures"
import { PayrollHistory } from "@/components/payroll-history"

export default function PayrollPage() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/payroll/generate" replace />} />
      <Route path="/generate" element={<PayrollGenerate />} />
      <Route path="/structures" element={<PayrollStructures />} />
      <Route path="/history" element={<PayrollHistory />} />
    </Routes>
  )
}
