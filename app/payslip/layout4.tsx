import { SidebarProvider } from '@/components/sidebar-provider'

export default function PayslipLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-col gap-4 p-6">
        {children}
      </div>
    </SidebarProvider>
  )
}