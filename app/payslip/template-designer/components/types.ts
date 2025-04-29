import { Allowance, Deduction } from "@/lib/db/models/payroll-structure.model"

// Template element types
export interface ColumnDefinition {
  id: string
  header: string
  width: string
  alignment?: 'left' | 'center' | 'right'
}

export interface RowDefinition {
  [key: string]: string | { value: string; dynamicField?: string } | boolean | undefined
  isTotal?: boolean
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted'
  imageUrl?: string
  dynamicField?: string
  showAllowances?: boolean
  showDeductions?: boolean
  showTotals?: boolean
}

export interface TemplateElement {
  id: string
  type: 'text' | 'image' | 'table' | 'spacer' | 'divider' | 'grid' | 'salary-structure'
  content?: string
  properties: {
    // Layout properties
    width?: string
    height?: string
    alignment?: 'left' | 'center' | 'right'
    padding?: string
    margin?: string
    gap?: string
    
    // Border properties
    borderWidth?: number
    borderColor?: string
    borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted'
    
    // Text styling
    fontSize?: number
    fontWeight?: 'normal' | 'bold'
    fontStyle?: 'normal' | 'italic'
    textDecoration?: 'none' | 'underline'
    color?: string
    backgroundColor?: string
    
    // Content properties
    imageUrl?: string
    dynamicField?: string
    
    // Table/grid properties
    columns?: number | ColumnDefinition[]
    rows?: RowDefinition[]
    
    // Salary structure visibility
    showAllowances?: boolean
    showDeductions?: boolean
    showTotals?: boolean
    
    // Index signature for additional properties
    [key: string]: unknown
  }
  children?: TemplateElement[]
}

// Template definition
export interface Template {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  elements: TemplateElement[]
  settings: {
    pageSize: 'A4' | 'Letter' | 'Legal'
    orientation: 'portrait' | 'landscape'
    margins: {
      top: number
      right: number
      bottom: number
      left: number
    }
    headerHeight: number
    footerHeight: number
    primaryColor: string
    secondaryColor: string
    fontFamily: string
    showPageNumbers: boolean
    [key: string]: any
  }
}

// Available dynamic fields
export const DYNAMIC_FIELDS = [
  { id: 'employee.name', label: 'Employee Name' },
  { id: 'employee.id', label: 'Employee ID' },
  { id: 'employee.department', label: 'Department' },
  { id: 'employee.position', label: 'Position' },
  { id: 'payslip.period', label: 'Pay Period' },
  { id: 'payslip.date', label: 'Payment Date' },
  { id: 'salary.basic', label: 'Basic Salary' },
  { id: 'salary.gross', label: 'Gross Salary' },
  { id: 'salary.net', label: 'Net Salary' },
  { id: 'deductions.tax', label: 'Tax Deduction' },
  { id: 'deductions.total', label: 'Total Deductions' },
  { id: 'allowances.total', label: 'Total Allowances' },
  { id: 'company.name', label: 'Company Name' },
  { id: 'company.address', label: 'Company Address' },
  { id: 'company.logo', label: 'Company Logo' },
]

// Default template configuration
export const DEFAULT_TEMPLATE: Template = {
  id: 'template_default',
  name: 'New Template',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  elements: [],
  settings: {
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
    headerHeight: 15,
    footerHeight: 15,
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    fontFamily: 'Helvetica',
    showPageNumbers: true
  }
}

// Preview data for template design
export interface PreviewData {
  'employee.name': string
  'employee.id': string
  'employee.department': string
  'employee.position': string
  'payslip.period': string
  'payslip.date': string
  'salary.basic': string
  'salary.gross': string
  'salary.net': string
  'deductions.tax': string
  'deductions.total': string
  'allowances.total': string
  'company.name': string
  'company.address': string
  'company.logo': string
  allowances: Allowance[]
  deductions: Deduction[]
  [key: string]: any
}

// Default preview data
export const DEFAULT_PREVIEW_DATA: PreviewData = {
  'employee.name': 'John Doe',
  'employee.id': 'EMP001',
  'employee.department': 'Engineering',
  'employee.position': 'Senior Developer',
  'payslip.period': 'April 2025',
  'payslip.date': '30/04/2025',
  'salary.basic': '$3,500.00',
  'salary.gross': '$4,200.00',
  'salary.net': '$3,150.00',
  'deductions.tax': '$840.00',
  'deductions.total': '$1,050.00',
  'allowances.total': '$700.00',
  'company.name': 'ACME Corporation',
  'company.address': '123 Business Street, City, Country',
  'company.logo': '/logo.png',
  allowances: [
    { id: '1', name: 'Housing Allowance', type: 'fixed', value: 500 },
    { id: '2', name: 'Transport Allowance', type: 'fixed', value: 200 },
  ],
  deductions: [
    { id: '1', name: 'Income Tax', type: 'percentage', value: 20, preTax: true },
    { id: '2', name: 'Health Insurance', type: 'fixed', value: 150, preTax: true },
    { id: '3', name: 'Retirement Fund', type: 'percentage', value: 5, preTax: false },
  ]
}