# Leave Management Feature Implementation Plan

## 1. Component Modifications

### employees-list.tsx
- Add new action handler:
```typescript
const handleManageLeave = (id: string) => {
  router.push(`/employees/${id}/leave`)
}
```

- Add to dropdown menu (around line 288):
```typescript
<DropdownMenuItem onClick={() => handleManageLeave(employee._id)}>
  Manage Leave
</DropdownMenuItem>
```

## 2. New Components

### EmployeeLeaveManagement.tsx
```typescript
"use client"
import { calculateLeaveBalance } from "@/lib/utils/leave-calculations"
// ... other imports

export default function EmployeeLeaveManagement({ employeeId }: { employeeId: string }) {
  // Implementation...
}
```

## 3. Route Setup

### app/employees/[id]/leave/page.tsx
```typescript
import EmployeeLeaveManagement from "@/components/employee-leave-management"

export default function Page({ params }: { params: { id: string } }) {
  return <EmployeeLeaveManagement employeeId={params.id} />
}
```

## 4. Database Services

### lib/db/services/employee.service.ts
Add new methods:
```typescript
interface EmployeeService {
  getLeaveBalance(employeeId: string): Promise<number>
  updateLeaveBalance(employeeId: string, days: number): Promise<void>
  getLeaveHistory(employeeId: string): Promise<LeaveHistory[]>
}
```

## 5. Utility Functions

### lib/utils/leave-calculations.ts
```typescript
export function calculateLeaveBalance(startDate: string): number {
  const months = differenceInMonths(new Date(), new Date(startDate))
  return Math.max(0, months * 2) // 2 days per month
}
```

## Implementation Timeline

1. Day 1: 
   - Create basic leave management route and component shell
   - Add action to employees list

2. Day 2:
   - Implement leave balance calculation
   - Create leave history display

3. Day 3:
   - Implement leave request form
   - Add database integration

4. Day 4:
   - Testing and refinements
   - Documentation