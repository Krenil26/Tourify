import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { UserProfile } from "@/components/user-profile"

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <UserProfile />
      <Footer />
    </main>
  )
}
