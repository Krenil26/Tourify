import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WildlifeInsightExplorer } from "@/components/wildlife-insight-explorer"

export const metadata = {
    title: "Wildlife Insight | Tourify.ai — Flora & Fauna AI Identifier",
    description: "Identify flora and fauna along your travel route. Explore our AI-powered wildlife encyclopedia with conservation status, sighting logs, and habitats.",
}

export default function WildlifeInsightPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-16">
                <WildlifeInsightExplorer />
            </div>
            <Footer />
        </main>
    )
}
