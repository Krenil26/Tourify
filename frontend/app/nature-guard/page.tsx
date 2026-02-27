import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { NatureGuardDashboard } from "@/components/nature-guard-dashboard"

export const metadata = {
    title: "Nature Guard | Tourify.ai — Real-Time Ecosystem & Weather Monitor",
    description: "Monitor live weather conditions and ecosystem health for your travel destinations with Tourify's Nature Guard system.",
}

export default function NatureGuardPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-16">
                <NatureGuardDashboard />
            </div>
            <Footer />
        </main>
    )
}
