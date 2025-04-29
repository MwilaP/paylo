"use client"

import { 
  Type, 
  Image, 
  Table, 
  LayoutGrid, 
  Columns, 
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TemplateElement } from "./types"
import { v4 as uuidv4 } from "uuid"

interface ElementPaletteProps {
  onAddElement: (element: TemplateElement) => void
}

export function ElementPalette({ onAddElement }: ElementPaletteProps) {
  // Create a new element of the specified type
  const createNewElement = (type: TemplateElement['type']) => {
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
          fontStyle: 'normal',
          textDecoration: 'none',
          alignment: 'left',
          color: '#000000',
        }
        break
      case 'image':
        newElement.properties = {
          width: '100%',
          height: 'auto',
          imageUrl: '',
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
      case 'salary-structure':
        newElement.properties = {
          showAllowances: true,
          showDeductions: true,
          showTotals: true,
          borderWidth: 1,
          borderColor: '#cccccc',
          borderStyle: 'solid',
        }
        break
    }
    
    onAddElement(newElement)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Elements</CardTitle>
        <CardDescription>
          Add elements to build your template
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => createNewElement('text')}
          >
            <Type className="h-4 w-4 mr-2" />
            Text
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => createNewElement('image')}
          >
            <Image className="h-4 w-4 mr-2" />
            Image
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => createNewElement('table')}
          >
            <Table className="h-4 w-4 mr-2" />
            Table
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => createNewElement('grid')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => createNewElement('divider')}
          >
            <Separator className="h-4 w-4 mr-2" />
            Divider
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => createNewElement('spacer')}
          >
            <Columns className="h-4 w-4 mr-2" />
            Spacer
          </Button>
          
          <div className="my-2">
            <Separator />
          </div>
          
          <Button 
            variant="default" 
            className="w-full justify-start" 
            onClick={() => createNewElement('salary-structure')}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Salary Structure
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}