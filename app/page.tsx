import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Modern Payroll Made Simple
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Automate your payroll process with our intuitive platform that saves time and reduces errors.
          </p>
          <div className="mt-10">
            <Button size="lg" asChild>
              <a href="/login">Get Started</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Automated Calculations</h3>
              <p className="text-muted-foreground">
                Accurate tax and deduction calculations without manual work.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Employee Self-Service</h3>
              <p className="text-muted-foreground">
                Empower employees to view payslips and update details.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Compliance Ready</h3>
              <p className="text-muted-foreground">
                Stay up-to-date with the latest tax laws and regulations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Businesses</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <blockquote className="space-y-4">
                <p className="text-muted-foreground">
                  "Reduced our payroll processing time by 80% while eliminating errors."
                </p>
                <footer className="font-medium">Sarah K., CFO</footer>
              </blockquote>
            </Card>
            <Card className="p-6">
              <blockquote className="space-y-4">
                <p className="text-muted-foreground">
                  "The employee self-service portal has saved our HR team countless hours."
                </p>
                <footer className="font-medium">Michael T., HR Director</footer>
              </blockquote>
            </Card>
            <Card className="p-6">
              <blockquote className="space-y-4">
                <p className="text-muted-foreground">
                  "Implementation was seamless and the support team is exceptional."
                </p>
                <footer className="font-medium">Lisa M., Operations Manager</footer>
              </blockquote>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}