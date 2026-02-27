import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GlobalSanctuaryExplorer } from "@/components/global-sanctuary-explorer"

export const metadata = {
    title: "Global Sanctuary | Tourify.ai — 5,000+ Protected Parks & Retreats",
    description: "Explore our global network of eco-certified protected parks, nature retreats, and sanctuaries across every continent.",
}

export default function GlobalSanctuaryPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-16">
                <GlobalSanctuaryExplorer />
            </div>
            <Footer />
        </main>
    )
}
