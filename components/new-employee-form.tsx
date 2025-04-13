"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export function NewEmployeeForm() {
  const [activeTab, setActiveTab] = useState("personal")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Employee created",
      description: "The employee has been successfully added to the system.",
    })
    router.push("/employees")
  }

  return (
    <Form>
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="job">Job Info</TabsTrigger>
            <TabsTrigger value="banking">Banking Info</TabsTrigger>
            <TabsTrigger value="tax">Tax Info</TabsTrigger>
          </TabsList>
          <TabsContent value="personal" className="space-y-4 pt-4">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="flex flex-col items-center gap-2">
                <div className="relative h-24 w-24 rounded-full border-2 border-dashed border-muted-foreground/25 p-1">
                  <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm">
                  Upload Photo
                </Button>
              </div>
              <div className="grid flex-1 gap-4 md:grid-cols-2">
                <FormField
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter full address" className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="button" onClick={() => setActiveTab("job")}>
                Next
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="job" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="hireDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Hire Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="reportingTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reporting To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manager" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="john-doe">John Doe (CEO)</SelectItem>
                        <SelectItem value="jane-smith">Jane Smith (CTO)</SelectItem>
                        <SelectItem value="robert-johnson">Robert Johnson (CFO)</SelectItem>
                        <SelectItem value="emily-davis">Emily Davis (HR Director)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="workLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hq">Headquarters</SelectItem>
                        <SelectItem value="branch-1">Branch Office 1</SelectItem>
                        <SelectItem value="branch-2">Branch Office 2</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setActiveTab("personal")}>
                Previous
              </Button>
              <Button type="button" onClick={() => setActiveTab("banking")}>
                Next
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="banking" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bank name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="branchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter branch name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC/SWIFT Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter IFSC/SWIFT code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setActiveTab("job")}>
                Previous
              </Button>
              <Button type="button" onClick={() => setActiveTab("tax")}>
                Next
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="tax" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter national ID number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="taxNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tax identification number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="pensionNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pension Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pension number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="taxStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tax status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="resident">Resident</SelectItem>
                        <SelectItem value="non-resident">Non-Resident</SelectItem>
                        <SelectItem value="foreign">Foreign National</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Upload Documents</FormLabel>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-dashed p-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">ID Proof</p>
                      <p className="text-xs text-muted-foreground">Upload a copy of national ID</p>
                    </div>
                    <Button type="button" variant="outline" size="sm">
                      Upload
                    </Button>
                  </div>
                </div>
                <div className="rounded-md border border-dashed p-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Contract</p>
                      <p className="text-xs text-muted-foreground">Upload signed employment contract</p>
                    </div>
                    <Button type="button" variant="outline" size="sm">
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setActiveTab("banking")}>
                Previous
              </Button>
              <Button type="submit">Create Employee</Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}
