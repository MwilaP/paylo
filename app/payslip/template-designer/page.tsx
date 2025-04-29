"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Image, 
  Type, 
  Table, 
  LayoutGrid, 
  Columns, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Check
} from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Template elements and types
interface TemplateElement {
  id: string
  type: 'text' | 'image' | 'table' | 'spacer' | 'divider' | 'grid'
  content?: string
  properties: {
    width?: string
    height?: string
    alignment?: 'left' | 'center' | 'right'
    fontSize?: number
    fontWeight?: 'normal' | 'bold'
    fontStyle?: 'normal' | 'italic'
    textDecoration?: 'none' | 'underline'
    color?: string
    backgroundColor?: string
    padding?: string
    margin?: string
    borderWidth?: number
    borderColor?: string
    borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted'
    columns?: number
    rows?: number
    imageUrl?: string
    dynamicField?: string
    [key: string]: any
  }
  children?: TemplateElement[]
}

interface Template {
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
const DYNAMIC_FIELDS = [
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

// Default template
const DEFAULT_TEMPLATE: Template = {
  id: uuidv4(),
  name: 'Default Template',
  description: 'Standard payslip template',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  elements: [
    {
      id: uuidv4(),
      type: 'grid',
      properties: {
        columns: 2,
        gap: '16px',
      },
      children: [
        {
          id: uuidv4(),
          type: 'text',
          content: '{company.name}',
          properties: {
            fontSize: 24,
            fontWeight: 'bold',
            alignment: 'left',
            dynamicField: 'company.name',
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'PAYSLIP',
          properties: {
            fontSize: 24,
            fontWeight: 'bold',
            alignment: 'right',
          }
        }
      ]
    },
    {
      id: uuidv4(),
      type: 'divider',
      properties: {
        margin: '16px 0',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#cccccc',
      }
    },
    {
      id: uuidv4(),
      type: 'grid',
      properties: {
        columns: 2,
        gap: '16px',
      },
      children: [
        {
          id: uuidv4(),
          type: 'text',
          content: 'Employee: {employee.name}',
          properties: {
            fontSize: 14,
            dynamicField: 'employee.name',
          }
        },
        {
          id: uuidv4(),
          type: 'text',
          content: 'Pay Period: {payslip.period}',
          properties: {
            fontSize: 14,
            alignment: 'right',
            dynamicField: 'payslip.period',
          }
        }
      ]
    },
    {
      id: uuidv4(),
      type: 'table',
      properties: {
        columns: [
          { id: 'description', header: 'Description', width: '50%' },
          { id: 'amount', header: 'Amount', width: '50%', alignment: 'right' }
        ],
        rows: [
          { description: 'Basic Salary', amount: '{salary.basic}', dynamicField: 'salary.basic' },
          { description: 'Allowances', amount: '{allowances.total}', dynamicField: 'allowances.total' },
          { description: 'Gross Salary', amount: '{salary.gross}', dynamicField: 'salary.gross' },
          { description: 'Tax Deduction', amount: '{deductions.tax}', dynamicField: 'deductions.tax' },
          { description: 'Other Deductions', amount: '{deductions.total}', dynamicField: 'deductions.total' },
          { description: 'Net Salary', amount: '{salary.net}', dynamicField: 'salary.net', isTotal: true }
        ],
        borderWidth: 1,
        borderColor: '#cccccc',
        borderStyle: 'solid',
      }
    }
  ],
  settings: {
    pageSize: 'A4',
    orientation: 'portrait',
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },
    headerHeight: 60,
    footerHeight: 40,
    primaryColor: '#1a73e8',
    secondaryColor: '#f1f3f4',
    fontFamily: 'Arial, sans-serif',
    showPageNumbers: true
  }
}

export default function TemplateDesignerPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('design')
  const [template, setTemplate] = useState<Template>(DEFAULT_TEMPLATE)
  const [selectedElement, setSelectedElement] = useState<TemplateElement | null>(null)
  const [previewData, setPreviewData] = useState({
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
  })
  
  // Handle element selection
  const handleSelectElement = (element: TemplateElement) => {
    setSelectedElement(element)
  }
  
  // Add a new element
  const handleAddElement = (type: TemplateElement['type']) => {
    const newElement: TemplateElement = {
      id: uuidv4(),
      type,
      properties: {}
    }
    
    // Set default properties based on element type
    switch (type) {
      case 'text':
        newElement.content = 'New Text Element'
        newElement.properties = {
          fontSize: 14,
          fontWeight: 'normal',
          alignment: 'left',
        }
        break
      case 'image':
        newElement.properties = {
          width: '100%',
          height: 'auto',
        }
        break
      case 'table':
        newElement.properties = {
          columns: [
            { id: 'col1', header: 'Column 1', width: '50%' },
            { id: 'col2', header: 'Column 2', width: '50%' }
          ],
          rows: [
            { col1: 'Row 1, Cell 1', col2: 'Row 1, Cell 2' },
            { col1: 'Row 2, Cell 1', col2: 'Row 2, Cell 2' }
          ],
          borderWidth: 1,
          borderColor: '#cccccc',
          borderStyle: 'solid',
        }
        break
      case 'spacer':
        newElement.properties = {
          height: '16px',
        }
        break
      case 'divider':
        newElement.properties = {
          margin: '16px 0',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: '#cccccc',
        }
        break
      case 'grid':
        newElement.properties = {
          columns: 2,
          gap: '16px',
        }
        newElement.children = []
        break
    }
    
    setTemplate(prevTemplate => ({
      ...prevTemplate,
      elements: [...prevTemplate.elements, newElement]
    }))
    
    // Select the new element
    setSelectedElement(newElement)
  }
  
  // Render a template element
  const renderElement = (element: TemplateElement) => {
    const isSelected = selectedElement?.id === element.id
    
    // Common element props
    const elementProps = {
      key: element.id,
      className: `template-element ${isSelected ? 'ring-2 ring-primary' : ''} relative`,
      onClick: () => handleSelectElement(element),
      style: {
        ...(element.properties.width ? { width: element.properties.width } : {}),
        ...(element.properties.height ? { height: element.properties.height } : {}),
        ...(element.properties.margin ? { margin: element.properties.margin } : {}),
        ...(element.properties.padding ? { padding: element.properties.padding } : {}),
        ...(element.properties.backgroundColor ? { backgroundColor: element.properties.backgroundColor } : {}),
      }
    }
    
    // Render based on element type
    switch (element.type) {
      case 'text':
        return (
          <div {...elementProps}>
            <p style={{
              fontSize: `${element.properties.fontSize || 14}px`,
              fontWeight: element.properties.fontWeight || 'normal',
              textAlign: element.properties.alignment || 'left',
              color: element.properties.color || '#000000',
            }}>
              {/* Replace dynamic field placeholders with preview data */}
              {element.content?.replace(/\{([^}]+)\}/g, (match, field) => {
                return previewData[field] || match
              })}
            </p>
          </div>
        )
      
      case 'image':
        return (
          <div {...elementProps}>
            {element.properties.imageUrl ? (
              <img 
                src={element.properties.imageUrl} 
                alt="Template image" 
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            ) : (
              <div className="flex items-center justify-center bg-muted h-32 w-full">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
        )
      
      case 'table':
        return (
          <div {...elementProps}>
            <table className="w-full border-collapse" style={{
              borderWidth: `${element.properties.borderWidth || 0}px`,
              borderStyle: element.properties.borderStyle || 'solid',
              borderColor: element.properties.borderColor || '#cccccc',
            }}>
              <thead>
                <tr>
                  {element.properties.columns?.map((column: any) => (
                    <th 
                      key={column.id}
                      className="p-2"
                      style={{
                        width: column.width,
                        textAlign: column.alignment || 'left',
                        borderWidth: `${element.properties.borderWidth || 0}px`,
                        borderStyle: element.properties.borderStyle || 'solid',
                        borderColor: element.properties.borderColor || '#cccccc',
                      }}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              https://openrouter.ai/settings/credits       <tbody>
                {element.properties.rows?.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex} className={row.isTotal ? 'font-bold' : ''}>
                    {element.properties.columns?.map((column: any) => {
                      const cellContent = row[column.id]
                      // Replace dynamic field placeholders with preview data
                      const displayContent = typeof cellContent === 'string' 
