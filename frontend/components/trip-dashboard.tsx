"use client"

import { Button } from "@/components/ui/button"
import { formatINR } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import {
  Plane,
  Hotel,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Users,
  ChevronRight,
  Plus,
  Bell,
  TrendingDown,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertCircle,
  Wallet,
  MoreHorizontal,
  User,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const BACKEND = "https://tourify-4cuu.onrender.com"

const upcomingTrips = [
  {
    id: 1,
    destination: "Tokyo, Japan",
    image: "/tokyo-city-night-neon-lights-shibuya.jpg",
    startDate: "Mar 15, 2026",
    endDate: "Mar 22, 2026",
    status: "confirmed",
    daysLeft: 64,
    totalCost: 2450,
    paidAmount: 1850,
    travelers: 2,
  },
  {
    id: 2,
    destination: "Bali, Indonesia",
    image: "/bali-tropical-beach-sunset-temple.jpg",
    startDate: "May 10, 2026",
    endDate: "May 18, 2026",
    status: "planning",
    daysLeft: 120,
    totalCost: 1800,
    paidAmount: 600,
    travelers: 4,
  },
]

const recentActivity = [
  {
    type: "price_drop",
    title: "Flight price dropped!",
    description: "Tokyo flight now ₹10,000 cheaper",
    time: "2 hours ago",
    icon: TrendingDown,
    color: "text-chart-3",
  },
  {
    type: "booking",
    title: "Hotel confirmed",
    description: "Park Hyatt Tokyo - 7 nights",
    time: "Yesterday",
    icon: CheckCircle2,
    color: "text-primary",
  },
  {
    type: "reminder",
    title: "Payment due soon",
    description: "Bali trip - ₹35,000 remaining",
    time: "2 days ago",
    icon: AlertCircle,
    color: "text-chart-4",
  },
  {
    type: "price_increase",
    title: "Activity price increased",
    description: "Mt. Fuji tour now ₹1,200 more",
    time: "3 days ago",
    icon: TrendingUp,
    color: "text-destructive",
  },
]

const savedDestinations = [
  { name: "Santorini", image: "/santorini-white-blue.png", price: 1599 },
  { name: "Maldives", image: "/maldives-overwater-villa-crystal-clear-ocean.jpg", price: 2499 },
  { name: "Paris", image: "/paris-eiffel-tower-city-lights-romantic.jpg", price: 1399 },
]

const budgetCategories = [
  { name: "Flights", spent: 850, budget: 1000, color: "bg-primary" },
  { name: "Hotels", spent: 720, budget: 900, color: "bg-chart-2" },
  { name: "Activities", spent: 180, budget: 400, color: "bg-chart-3" },
  { name: "Food", spent: 100, budget: 350, color: "bg-chart-4" },
]

export function TripDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])
  const [activeTrip, setActiveTrip] = useState<any>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("user")
    const token = sessionStorage.getItem("token")
    if (stored && token) {
      const parsedUser = JSON.parse(stored)
      setUser(parsedUser)

      // Fetch real bookings
      fetch(`${BACKEND}/api/bookings/my`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const sorted = Array.isArray(data) ? data : []
          setBookings(sorted)
          if (sorted.length > 0) setActiveTrip(sorted[0])
          setIsLoading(false)
        })
        .catch(err => {
          console.error("Dashboard fetch error:", err)
          setIsLoading(false)
        })
    } else {
      router.push("/login")
    }
  }, [router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const BACKEND_URL = "https://tourify-4cuu.onrender.com" // Ensure consistency

  const totalBudget = budgetCategories.reduce((acc, cat) => acc + cat.budget, 0)
  const totalSpent = budgetCategories.reduce((acc, cat) => acc + cat.spent, 0)

  // Use the user's first name, or "Explorer" if not logged in
  const firstName = user?.name ? user.name.split(" ")[0] : "Explorer"

  return (
    <section className="min-h-screen pt-20 pb-12 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pt-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Welcome back, {firstName}</h1>
            <p className="text-muted-foreground">Track your trips and manage your travel plans</p>
          </div>
          <div className="flex gap-3 items-center">
            <Link href="/profile" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-all border border-border group">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-foreground">Profile</span>
            </Link>

            <Link href="/planner">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan rounded-xl h-10 px-6 font-bold text-sm">
                <Plus className="w-4 h-4 mr-2" />
                New Trip
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Trips */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Upcoming Trips</h2>
                <Link href="/profile" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-10 bg-secondary/30 rounded-xl border border-dashed border-border">
                    <p className="text-muted-foreground text-sm mb-4">You don't have any trips planned yet.</p>
                    <Link href="/planner">
                      <Button variant="outline" size="sm" className="rounded-lg">Start Planning</Button>
                    </Link>
                  </div>
                ) : (
                  bookings.map((trip) => (
                    <div
                      key={trip.id}
                      onClick={() => setActiveTrip(trip)}
                      className={`flex flex-col sm:flex-row gap-4 p-4 rounded-xl cursor-pointer transition-all ${activeTrip?.id === trip.id
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-secondary hover:bg-secondary/80"
                        }`}
                    >
                      <div className="w-full sm:w-24 h-32 sm:h-24 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{trip.destination}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {trip.startDate} - {trip.endDate}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${trip.status === "approved" ? "bg-emerald-500/20 text-emerald-500" :
                              trip.status === "rejected" ? "bg-red-500/20 text-red-500" :
                                "bg-amber-500/20 text-amber-500"
                              }`}
                          >
                            {trip.status || "Pending"}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground font-semibold text-emerald-400">
                            <span>{formatINR(trip.totalCost)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="w-3.5 h-3.5" />
                            <span>{trip.travelers} travelers</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Payment Status</span>
                            <span className="text-foreground font-medium">
                              Verified
                            </span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Trip Details Card */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">{activeTrip.destination} - Itinerary</h2>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: Plane, label: "Flights", value: "Booked", color: "text-primary" },
                  { icon: Hotel, label: "Hotels", value: "Booked", color: "text-chart-3" },
                  { icon: MapPin, label: "Activities", value: "5 planned", color: "text-chart-4" },
                  { icon: Wallet, label: "Budget", value: formatINR(totalBudget), color: "text-chart-2" },
                ].map((stat, index) => (
                  <div key={index} className="bg-secondary rounded-xl p-4 text-center">
                    <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-sm font-semibold text-foreground">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Mini Itinerary */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Itinerary - Day by Day</h3>
                {activeTrip?.itinerary ? (
                  activeTrip.itinerary.split('\n').filter((line: string) => line.trim()).slice(0, 5).map((line: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{line}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-secondary/50 border border-dashed border-border text-center">
                    <p className="text-xs text-muted-foreground italic">No itinerary details available for this request.</p>
                  </div>
                )}
              </div>

              <Button className="w-full mt-6 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground">
                View Full Itinerary
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Budget Overview */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Budget Tracker</h2>
                <Wallet className="w-5 h-5 text-primary" />
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-foreground">{formatINR(totalSpent)}</div>
                <div className="text-sm text-muted-foreground">of {formatINR(totalBudget)} budget</div>
                <Progress value={(totalSpent / totalBudget) * 100} className="h-3 mt-3" />
              </div>

              <div className="space-y-3">
                {budgetCategories.map((cat, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{cat.name}</span>
                      <span className="text-foreground">
                        {formatINR(cat.spent)} / {formatINR(cat.budget)}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.color} rounded-full transition-all`}
                        style={{ width: `${(cat.spent / cat.budget) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{activity.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{activity.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Destinations */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Saved Destinations</h2>
                <Link href="/destinations" className="text-sm text-primary hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {savedDestinations.map((dest, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <img
                      src={dest.image || "/placeholder.svg"}
                      alt={dest.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{dest.name}</div>
                      <div className="text-xs text-muted-foreground">From {formatINR(dest.price)}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>

              {/* AI Suggestion */}
              <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">AI Suggestion</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on your preferences, you might love visiting the Swiss Alps in December!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
