"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Template } from "./types"

interface TemplateSettingsProps {
  template: Template
  onSettingsChange: (setting: string, value: any) => void
}

export function TemplateSettings({ template, onSettingsChange }: TemplateSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Settings</CardTitle>
        <CardDescription>Configure page layout and global styles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Page Size</Label>
          <Select
            value={template.settings.pageSize}
            onValueChange={(value) => onSettingsChange('pageSize', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4</SelectItem>
              <SelectItem value="Letter">Letter</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Orientation</Label>
          <Select
            value={template.settings.orientation}
            onValueChange={(value) => onSettingsChange('orientation', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select orientation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Margins (mm)</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Top</Label>
              <Slider
                min={0}
                max={50}
                step={1}
                value={[template.settings.margins.top]}
                onValueChange={(value) => onSettingsChange('margins', {
                  ...template.settings.margins,
                  top: value[0]
                })}
              />
            </div>
            <div>
              <Label>Bottom</Label>
              <Slider
                min={0}
                max={50}
                step={1}
                value={[template.settings.margins.bottom]}
                onValueChange={(value) => onSettingsChange('margins', {
                  ...template.settings.margins,
                  bottom: value[0]
                })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="page-numbers"
              checked={template.settings.showPageNumbers}
              onCheckedChange={(checked) => onSettingsChange('showPageNumbers', checked)}
            />
            <Label htmlFor="page-numbers">Show Page Numbers</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}