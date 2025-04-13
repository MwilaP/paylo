import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function PayrollSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure your payroll processing preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payroll Cycle</Label>
              <RadioGroup defaultValue="monthly">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bi-weekly" id="bi-weekly" />
                  <Label htmlFor="bi-weekly">Bi-weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="payment-date">Payment Date</Label>
                <Select defaultValue="last-day">
                  <SelectTrigger id="payment-date">
                    <SelectValue placeholder="Select payment date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-day">Last day of month</SelectItem>
                    <SelectItem value="first-day">First day of month</SelectItem>
                    <SelectItem value="custom">Custom date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-currency">Default Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="default-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD - US Dollar</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="gbp">GBP - British Pound</SelectItem>
                    <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="auto-process">Automatic Processing</Label>
                <p className="text-sm text-muted-foreground">Automatically process payroll on scheduled dates</p>
              </div>
              <Switch id="auto-process" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tax Settings</CardTitle>
          <CardDescription>Configure tax calculation preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tax-year">Tax Year</Label>
                <Select defaultValue="2025">
                  <SelectTrigger id="tax-year">
                    <SelectValue placeholder="Select tax year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax-calculation">Tax Calculation Method</Label>
                <Select defaultValue="progressive">
                  <SelectTrigger id="tax-calculation">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="progressive">Progressive</SelectItem>
                    <SelectItem value="flat">Flat Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Default Tax Rates</Label>
              <div className="rounded-md border">
                <div className="grid grid-cols-3 gap-4 p-4 font-medium">
                  <div>Income Range</div>
                  <div>Rate (%)</div>
                  <div></div>
                </div>
                <div className="border-t grid grid-cols-3 gap-4 p-4">
                  <div className="flex items-center">$0 - $10,000</div>
                  <div>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      &times;
                    </Button>
                  </div>
                </div>
                <div className="border-t grid grid-cols-3 gap-4 p-4">
                  <div className="flex items-center">$10,001 - $50,000</div>
                  <div>
                    <Input type="number" defaultValue="15" />
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      &times;
                    </Button>
                  </div>
                </div>
                <div className="border-t grid grid-cols-3 gap-4 p-4">
                  <div className="flex items-center">$50,001 - $100,000</div>
                  <div>
                    <Input type="number" defaultValue="20" />
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      &times;
                    </Button>
                  </div>
                </div>
                <div className="border-t grid grid-cols-3 gap-4 p-4">
                  <div className="flex items-center">$100,001+</div>
                  <div>
                    <Input type="number" defaultValue="25" />
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      &times;
                    </Button>
                  </div>
                </div>
                <div className="border-t p-4">
                  <Button variant="outline" size="sm">
                    Add Tax Bracket
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure email notifications for payroll events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="notify-employees">Notify Employees</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications to employees when payslips are generated
                </p>
              </div>
              <Switch id="notify-employees" defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="notify-admins">Notify Administrators</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications to administrators before and after payroll processing
                </p>
              </div>
              <Switch id="notify-admins" defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="notify-errors">Error Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications when errors occur during payroll processing
                </p>
              </div>
              <Switch id="notify-errors" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  )
}
