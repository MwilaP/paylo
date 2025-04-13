"use client"

import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EmployeeFilters() {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search employees..." className="pl-8" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:flex md:w-auto">
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="hr">Human Resources</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="on-leave">On Leave</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="col-span-2">
          Reset Filters
        </Button>
      </div>
    </div>
  )
}
