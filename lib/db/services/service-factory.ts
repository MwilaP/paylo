"use client"

import { getDatabases } from "../db-service"

// Mock services for when database is not available
const mockEmployeeService = {
  createEmployee: async () => {
    console.warn("Using mock employee service: createEmployee")
    return null
  },
  getEmployeeById: async () => {
    console.warn("Using mock employee service: getEmployeeById")
    return null
  },
  updateEmployee: async () => {
    console.warn("Using mock employee service: updateEmployee")
    return null
  },
  deleteEmployee: async () => {
    console.warn("Using mock employee service: deleteEmployee")
    return null
  },
  getAllEmployees: async () => {
    console.warn("Using mock employee service: getAllEmployees")
    return []
  },
  searchEmployees: async () => {
    console.warn("Using mock employee service: searchEmployees")
    return []
  },
  filterEmployeesByDepartment: async () => {
    console.warn("Using mock employee service: filterEmployeesByDepartment")
    return []
  },
  filterEmployeesByStatus: async () => {
    console.warn("Using mock employee service: filterEmployeesByStatus")
    return []
  },
  getEmployeesByPayrollStructure: async () => {
    console.warn("Using mock employee service: getEmployeesByPayrollStructure")
    return []
  },
  assignPayrollStructure: async () => {
    console.warn("Using mock employee service: assignPayrollStructure")
    return null
  },
  bulkAssignPayrollStructure: async () => {
    console.warn("Using mock employee service: bulkAssignPayrollStructure")
    return []
  },
}

const mockPayrollStructureService = {
  createPayrollStructure: async () => {
    console.warn("Using mock payroll structure service: createPayrollStructure")
    return null
  },
  getPayrollStructureById: async () => {
    console.warn("Using mock payroll structure service: getPayrollStructureById")
    return null
  },
  updatePayrollStructure: async () => {
    console.warn("Using mock payroll structure service: updatePayrollStructure")
    return null
  },
  deletePayrollStructure: async () => {
    console.warn("Using mock payroll structure service: deletePayrollStructure")
    return null
  },
  getAllPayrollStructures: async () => {
    console.warn("Using mock payroll structure service: getAllPayrollStructures")
    return []
  },
  searchPayrollStructures: async () => {
    console.warn("Using mock payroll structure service: searchPayrollStructures")
    return []
  },
  calculateSalaryDetails: (structure) => {
    console.warn("Using mock payroll structure service: calculateSalaryDetails")
    return {
      basicSalary: structure?.basicSalary || 0,
      totalAllowances: 0,
      totalDeductions: 0,
      grossSalary: structure?.basicSalary || 0,
      netSalary: structure?.basicSalary || 0,
    }
  },
}

const mockPayrollHistoryService = {
  createPayrollRecord: async () => {
    console.warn("Using mock payroll history service: createPayrollRecord")
    return null
  },
  getPayrollRecordById: async () => {
    console.warn("Using mock payroll history service: getPayrollRecordById")
    return null
  },
  updatePayrollRecord: async () => {
    console.warn("Using mock payroll history service: updatePayrollRecord")
    return null
  },
  deletePayrollRecord: async () => {
    console.warn("Using mock payroll history service: deletePayrollRecord")
    return null
  },
  getAllPayrollRecords: async () => {
    console.warn("Using mock payroll history service: getAllPayrollRecords")
    return []
  },
  getPayrollRecordsByEmployee: async () => {
    console.warn("Using mock payroll history service: getPayrollRecordsByEmployee")
    return []
  },
  getPayrollRecordsByDateRange: async () => {
    console.warn("Using mock payroll history service: getPayrollRecordsByDateRange")
    return []
  },
  getPayrollRecordsByStatus: async () => {
    console.warn("Using mock payroll history service: getPayrollRecordsByStatus")
    return []
  },
  processPayroll: async () => {
    console.warn("Using mock payroll history service: processPayroll")
    return null
  },
  bulkProcessPayroll: async () => {
    console.warn("Using mock payroll history service: bulkProcessPayroll")
    return []
  },
}

// Lazy-loaded services
let _employeeService: any = null
let _payrollStructureService: any = null
let _payrollHistoryService: any = null

// Import service factories
import { employeeService } from "./employee.service"
import { payrollStructureService } from "./payroll-structure.service"
import { payrollHistoryService } from "./payroll-history.service"

// Safe getter for employee service
export const getEmployeeService = async () => {
  // Skip if we're not in a browser environment
  if (typeof window === "undefined") {
    return mockEmployeeService
  }

  // Return cached service if available
  if (_employeeService) {
    return _employeeService
  }

  try {
    const databases = await getDatabases()

    // Use mock service if database is not available
    if (!databases.employees) {
      console.warn("Employee database not available, using mock service")
      return mockEmployeeService
    }

    _employeeService = employeeService(databases.employees)
    return _employeeService
  } catch (error) {
    console.error("Error getting employee service:", error)
    return mockEmployeeService
  }
}

// Safe getter for payroll structure service
export const getPayrollStructureService = async () => {
  // Skip if we're not in a browser environment
  if (typeof window === "undefined") {
    return mockPayrollStructureService
  }

  // Return cached service if available
  if (_payrollStructureService) {
    return _payrollStructureService
  }

  try {
    const databases = await getDatabases()

    // Use mock service if database is not available
    if (!databases.payrollStructures) {
      console.warn("Payroll structure database not available, using mock service")
      return mockPayrollStructureService
    }

    _payrollStructureService = payrollStructureService(databases.payrollStructures)
    return _payrollStructureService
  } catch (error) {
    console.error("Error getting payroll structure service:", error)
    return mockPayrollStructureService
  }
}

// Safe getter for payroll history service
export const getPayrollHistoryService = async () => {
  // Skip if we're not in a browser environment
  if (typeof window === "undefined") {
    return mockPayrollHistoryService
  }

  // Return cached service if available
  if (_payrollHistoryService) {
    return _payrollHistoryService
  }

  try {
    const databases = await getDatabases()

    // Use mock service if database is not available
    if (!databases.payrollHistory) {
      console.warn("Payroll history database not available, using mock service")
      return mockPayrollHistoryService
    }

    _payrollHistoryService = payrollHistoryService(databases.payrollHistory)
    return _payrollHistoryService
  } catch (error) {
    console.error("Error getting payroll history service:", error)
    return mockPayrollHistoryService
  }
}
