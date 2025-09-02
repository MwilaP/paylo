import { Routes, Route, Navigate } from 'react-router-dom'
// Note: Google Fonts will be loaded via CSS import in main.tsx

import { AuthProvider } from '@/lib/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarProvider } from '@/components/sidebar-provider'
import { Toaster } from '@/components/ui/toaster'

// Import pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EmployeesPage from './pages/EmployeesPage'
import EmployeeNewPage from './pages/EmployeeNewPage'
import EmployeeDetailPage from './pages/EmployeeDetailPage'
import LeavePage from './pages/LeavePage'
import PayrollPage from './pages/PayrollPage'
import ReportsPage from './pages/ReportsPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

function App() {
  return (
    <div className="font-sans">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/new" element={<EmployeeNewPage />} />
              <Route path="/employees/:id" element={<EmployeeDetailPage />} />
              <Route path="/leave" element={<LeavePage />} />
              <Route path="/payroll/*" element={<PayrollPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </div>
  )
}

export default App
