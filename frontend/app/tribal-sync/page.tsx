import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TribalSyncFeed } from "@/components/tribal-sync-feed"

export const metadata = {
    title: "Tribal Sync | Tourifyy — Explorer Community Feed",
    description: "Share your travel discoveries and connect with fellow nature explorers in the Tourifyy Tribal Sync community.",
}

export default function TribalSyncPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-16">
                <TribalSyncFeed />
            </div>
            <Footer />
        </main>
    )
}
