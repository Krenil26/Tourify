import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AIPlannerInterface } from "@/components/ai-planner-interface"

export default function PlannerPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <AIPlannerInterface />
      <Footer />
    </main>
  )
}
