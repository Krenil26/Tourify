import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TripDashboard } from "@/components/trip-dashboard"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <TripDashboard />
      <Footer />
    </main>
  )
}
