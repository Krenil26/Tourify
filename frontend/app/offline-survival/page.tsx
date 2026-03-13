import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OfflineSurvivalDashboard } from "@/components/offline-survival-dashboard"

export const metadata = {
    title: "Offline Survival Mode | Tourifyy — Wilderness Safety Kit",
    description: "Download per-destination offline survival packs. Cached maps, first-aid guides, phrase books, emergency contacts, and SOS beacon — no internet required.",
}

export default function OfflineSurvivalPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-16">
                <OfflineSurvivalDashboard />
            </div>
            <Footer />
        </main>
    )
}
