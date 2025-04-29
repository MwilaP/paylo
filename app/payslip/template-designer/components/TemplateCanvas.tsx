"use client"

import { Image, LayoutGrid, Columns } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Template, TemplateElement, PreviewData } from "./types"

interface TemplateCanvasProps {
  template: Template
  previewData: PreviewData
  onSelectElement: (element: TemplateElement | null, path?: string[]) => void
  selectedElementId: string | null
}

export function TemplateCanvas({ template, previewData, onSelectElement, selectedElementId }: TemplateCanvasProps) {

  // Render a template element recursively
  const renderElement = (element: TemplateElement, path: string[] = []) => {
    const isSelected = selectedElementId === element.id

    // Common element props
    const elementProps = {
      key: element.id,
      className: `template-element ${isSelected ? 'ring-2 ring-primary' : ''} relative p-2 border border-dashed border-transparent hover:border-muted-foreground/20 cursor-pointer`,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        onSelectElement(element, path)
      },
      style: {
        ...(element.properties.width ? { width: element.properties.width } : {}),
        ...(element.properties.height ? { height: element.properties.height } : {}),
        ...(element.properties.margin ? { margin: element.properties.margin } : {}),
        ...(element.properties.padding ? { padding: element.properties.padding } : {}),
        ...(element.properties.backgroundColor ? { backgroundColor: element.properties.backgroundColor } : {}),
        ...(element.properties.borderWidth ? {
          borderWidth: `${element.properties.borderWidth}px`,
          borderStyle: element.properties.borderStyle || 'solid',
          borderColor: element.properties.borderColor || '#000000'
        } : {})
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
              fontStyle: element.properties.fontStyle || 'normal',
              textDecoration: element.properties.textDecoration || 'none',
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
                  {Array.isArray(element.properties.columns) && element.properties.columns?.map((column: any) => (
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
              <tbody>
                {Array.isArray(element.properties.rows) && element.properties.rows?.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex} className={row.isTotal ? 'font-bold' : ''}>
                    {Array.isArray(element.properties.columns) && element.properties.columns?.map((column: any) => {
                      const cellContent = row[column.id]
                      // Replace dynamic field placeholders with preview data
                      const displayContent = typeof cellContent === 'string'
                        ? cellContent.replace(/\{([^}]+)\}/g, (match, field) => {
                            return previewData[field] || match
                          })
                        : cellContent

                      return (
                        <td
                          key={column.id}
                          className="p-2"
                          style={{
                            textAlign: column.alignment || 'left',
                            borderWidth: `${element.properties.borderWidth || 0}px`,
                            borderStyle: element.properties.borderStyle || 'solid',
                            borderColor: element.properties.borderColor || '#cccccc',
                          }}
                        >
                          {displayContent}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      case 'spacer':
        return (
          <div
            {...elementProps}
            style={{
              ...elementProps.style,
              height: element.properties.height || '16px',
            }}
          />
        )

      case 'divider':
        return (
          <div {...elementProps}>
            <hr style={{
              margin: element.properties.margin || '16px 0',
              borderWidth: `${element.properties.borderWidth || 1}px 0 0 0`,
              borderStyle: element.properties.borderStyle || 'solid',
              borderColor: element.properties.borderColor || '#cccccc',
            }} />
          </div>
        )

      case 'grid':
        return (
          <div
            {...elementProps}
            style={{
              ...elementProps.style,
              display: 'grid',
              gridTemplateColumns: `repeat(${element.properties.columns || 2}, 1fr)`,
              gap: element.properties.gap || '16px',
            }}
          >
            {element.children?.map((child, index) =>
              renderElement(child, [...path, element.id])
            )}

            {/* Add placeholder if grid is empty */}
            {(!element.children || element.children.length === 0) && (
              <div className="col-span-full flex items-center justify-center bg-muted/50 h-32 border border-dashed border-muted-foreground/20 rounded-md">
                <p className="text-sm text-muted-foreground">Drag elements here</p>
              </div>
            )}
          </div>
        )

      case 'salary-structure':
        // This is a simplified representation for the designer
        return (
          <div {...elementProps}>
            <Card className="w-full">
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg">Salary Structure</CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-sm">
                <p>Basic Salary: {previewData['salary.basic']}</p>
                {element.properties.showAllowances && (
                  <>
                    <h4 className="font-semibold mt-2">Allowances:</h4>
                    {previewData.allowances.map(allowance => (
                      <p key={allowance.id}>{allowance.name}: {allowance.type === 'fixed' ? `$${allowance.value.toFixed(2)}` : `${allowance.value}%`}</p>
                    ))}
                    <p className="font-semibold">Total Allowances: {previewData['allowances.total']}</p>
                  </>
                )}
                 {element.properties.showDeductions && (
                  <>
                    <h4 className="font-semibold mt-2">Deductions:</h4>
                    {previewData.deductions.map(deduction => (
                      <p key={deduction.id}>{deduction.name}: {deduction.type === 'fixed' ? `$${deduction.value.toFixed(2)}` : `${deduction.value}%`} ({deduction.preTax ? 'Pre-tax' : 'Post-tax'})</p>
                    ))}
                    <p className="font-semibold">Total Deductions: {previewData['deductions.total']}</p>
                  </>
                )}
                {element.properties.showTotals && (
                   <p className="font-bold mt-2">Net Salary: {previewData['salary.net']}</p>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Template Canvas</CardTitle>
        <CardDescription>
          Click on elements to edit their properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="min-h-[600px] p-8 border rounded-md bg-white"
          style={{
            width: template.settings.pageSize === 'A4' ? '210mm' : '8.5in',
            margin: '0 auto',
            padding: `${template.settings.margins.top}mm ${template.settings.margins.right}mm ${template.settings.margins.bottom}mm ${template.settings.margins.left}mm`,
            fontFamily: template.settings.fontFamily,
          }}
          onClick={() => onSelectElement(null)} // Deselect when clicking canvas
        >
          {template.elements.map(element => renderElement(element))}
        </div>
      </CardContent>
    </Card>
  )
}