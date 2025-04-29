"use client"

import { Badge } from "@/components/ui/badge"
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Trash2,
  Bold,
  Italic,
  Underline,
  Check,
  LayoutGrid
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { TemplateElement, DYNAMIC_FIELDS } from "./types"

interface PropertiesPanelProps {
  selectedElement: TemplateElement | null
  onPropertyChange: (property: string, value: any) => void
  onDeleteElement: () => void
}

export function PropertiesPanel({ selectedElement, onPropertyChange, onDeleteElement }: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Properties</CardTitle>
          <CardDescription>
            Edit the selected element's properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
            <LayoutGrid className="h-12 w-12 mb-2 opacity-20" />
            <p>Select an element to edit its properties</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
        <CardDescription>
          Editing {selectedElement.type} element ({selectedElement.id.substring(0, 6)}...)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Element Type</Label>
          <Badge>{selectedElement.type}</Badge>
        </div>

        {selectedElement.type === 'text' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="text-content">Content</Label>
              <Textarea
                id="text-content"
                value={selectedElement.content || ''}
                onChange={(e) => onPropertyChange('content', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dynamic-field">Dynamic Field</Label>
              <Select
                value={selectedElement.properties.dynamicField || ''}
                onValueChange={(value) => onPropertyChange('dynamicField', value)}
              >
                <SelectTrigger id="dynamic-field">
                  <SelectValue placeholder="Select a dynamic field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {DYNAMIC_FIELDS.map(field => (
                    <SelectItem key={field.id} value={field.id}>{field.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="font-size"
                  min={8}
                  max={36}
                  step={1}
                  value={[selectedElement.properties.fontSize || 14]}
                  onValueChange={(value) => onPropertyChange('fontSize', value[0])}
                />
                <span className="w-8 text-center">{selectedElement.properties.fontSize || 14}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Font Style</Label>
              <div className="flex gap-2">
                <Button
                  variant={selectedElement.properties.fontWeight === 'bold' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('fontWeight', selectedElement.properties.fontWeight === 'bold' ? 'normal' : 'bold')}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedElement.properties.fontStyle === 'italic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('fontStyle', selectedElement.properties.fontStyle === 'italic' ? 'normal' : 'italic')}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedElement.properties.textDecoration === 'underline' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('textDecoration', selectedElement.properties.textDecoration === 'underline' ? 'none' : 'underline')}
                >
                  <Underline className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alignment</Label>
              <div className="flex gap-2">
                <Button
                  variant={selectedElement.properties.alignment === 'left' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('alignment', 'left')}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedElement.properties.alignment === 'center' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('alignment', 'center')}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedElement.properties.alignment === 'right' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPropertyChange('alignment', 'right')}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-color">Color</Label>
              <Input
                id="text-color"
                type="color"
                value={selectedElement.properties.color || '#000000'}
                onChange={(e) => onPropertyChange('color', e.target.value)}
              />
            </div>
          </>
        )}

        {selectedElement.type === 'image' && (
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              type="text"
              value={selectedElement.properties.imageUrl || ''}
              onChange={(e) => onPropertyChange('imageUrl', e.target.value)}
            />
          </div>
        )}

        {selectedElement.type === 'salary-structure' && (
          <>
            <div className="space-y-2">
              <Label>Display Options</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-allowances"
                  checked={selectedElement.properties.showAllowances !== false}
                  onCheckedChange={(checked) => onPropertyChange('showAllowances', checked)}
                />
                <Label htmlFor="show-allowances">Show Allowances</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-deductions"
                  checked={selectedElement.properties.showDeductions !== false}
                  onCheckedChange={(checked) => onPropertyChange('showDeductions', checked)}
                />
                <Label htmlFor="show-deductions">Show Deductions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-totals"
                  checked={selectedElement.properties.showTotals !== false}
                  onCheckedChange={(checked) => onPropertyChange('showTotals', checked)}
                />
                <Label htmlFor="show-totals">Show Totals</Label>
              </div>
            </div>
          </>
        )}

        <Separator />
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteElement}
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Element
        </Button>
      </CardContent>
    </Card>
  )
}