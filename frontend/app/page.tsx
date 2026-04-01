import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { DestinationsPreview } from "@/components/destinations-preview"
import { AIDemoSection } from "@/components/ai-demo-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DestinationsPreview />
      <AIDemoSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
