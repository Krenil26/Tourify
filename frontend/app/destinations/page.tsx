import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DestinationsExplorer } from "@/components/destinations-explorer"

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <DestinationsExplorer />
      <Footer />
    </main>
  )
}
