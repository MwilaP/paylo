// Test script to verify payroll structure functionality
import { initializeSQLiteDatabase } from './lib/db/indexeddb-sqlite-service'
import { createPayrollStructureServiceCompat } from './lib/db/sqlite-payroll-service'
import { createEmployeeServiceCompat } from './lib/db/sqlite-employee-service'

export async function testPayrollFunctionality() {
  console.log('🧪 Testing Payroll Structure Functionality...')
  
  try {
    // Initialize database
    console.log('1. Initializing database...')
    const { success } = await initializeSQLiteDatabase()
    if (!success) {
      throw new Error('Failed to initialize database')
    }
    console.log('✅ Database initialized successfully')

    // Test payroll structure service
    console.log('2. Testing payroll structure service...')
    const payrollService = createPayrollStructureServiceCompat()
    
    // Create a test payroll structure
    const testStructure = {
      name: 'Test Structure',
      description: 'Test payroll structure for verification',
      basicSalary: 50000,
      allowances: [
        { name: 'Transport Allowance', amount: 5000, type: 'fixed' },
        { name: 'Housing Allowance', amount: 10000, type: 'fixed' }
      ],
      deductions: [
        { name: 'Tax', amount: 5000, type: 'fixed' },
        { name: 'Insurance', amount: 2000, type: 'fixed' }
      ]
    }

    const createdStructure = await payrollService.create(testStructure)
    console.log('✅ Payroll structure created:', createdStructure.name)

    // Test fetching all structures
    const allStructures = await payrollService.getAll()
    console.log(`✅ Retrieved ${allStructures.length} payroll structures`)

    // Test employee service
    console.log('3. Testing employee service...')
    const employeeService = createEmployeeServiceCompat()

    // Create test employees
    const testEmployees = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        phone: '+260123456789',
        department: 'Engineering',
        designation: 'Software Developer',
        employmentType: 'full-time',
        status: 'active',
        hireDate: '2024-01-15'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@company.com',
        phone: '+260987654321',
        department: 'HR',
        designation: 'HR Manager',
        employmentType: 'full-time',
        status: 'active',
        hireDate: '2024-02-01'
      }
    ]

    const createdEmployees = []
    for (const emp of testEmployees) {
      const created = await employeeService.create(emp)
      createdEmployees.push(created)
      console.log(`✅ Employee created: ${created.firstName} ${created.lastName}`)
    }

    // Test assignment functionality
    console.log('4. Testing assignment functionality...')
    for (const employee of createdEmployees) {
      await employeeService.update(employee._id, {
        payrollStructureId: createdStructure._id
      })
      console.log(`✅ Assigned structure to ${employee.firstName} ${employee.lastName}`)
    }

    // Verify assignments
    const updatedEmployees = await employeeService.getAll()
    const assignedCount = updatedEmployees.filter(emp => emp.payrollStructureId === createdStructure._id).length
    console.log(`✅ ${assignedCount} employees successfully assigned to structure`)

    console.log('🎉 All tests passed! Payroll functionality is working correctly.')
    
    return {
      success: true,
      structuresCount: allStructures.length,
      employeesCount: updatedEmployees.length,
      assignedCount
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testPayrollFunctionality = testPayrollFunctionality
}
