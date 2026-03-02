"use client"

import { Button } from "@/components/ui/button"
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
    description: "Tokyo flight now $120 cheaper",
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
    description: "Bali trip - $400 remaining",
    time: "2 days ago",
    icon: AlertCircle,
    color: "text-chart-4",
  },
  {
    type: "price_increase",
    title: "Activity price increased",
    description: "Mt. Fuji tour now $15 more",
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
  const [activeTrip, setActiveTrip] = useState(upcomingTrips[0])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse user from localStorage", e)
      }
      setIsLoading(false)
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
                {upcomingTrips.map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => setActiveTrip(trip)}
                    className={`flex flex-col sm:flex-row gap-4 p-4 rounded-xl cursor-pointer transition-all ${activeTrip.id === trip.id
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-secondary hover:bg-secondary/80"
                      }`}
                  >
                    <img
                      src={trip.image || "/placeholder.svg"}
                      alt={trip.destination}
                      className="w-full sm:w-24 h-32 sm:h-24 rounded-lg object-cover"
                    />
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
                          className={`px-2 py-1 rounded-full text-xs font-medium ${trip.status === "confirmed" ? "bg-chart-3/20 text-chart-3" : "bg-chart-4/20 text-chart-4"
                            }`}
                        >
                          {trip.status === "confirmed" ? "Confirmed" : "Planning"}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{trip.daysLeft} days left</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-3.5 h-3.5" />
                          <span>{trip.travelers} travelers</span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Payment Progress</span>
                          <span className="text-foreground font-medium">
                            ${trip.paidAmount} / ${trip.totalCost}
                          </span>
                        </div>
                        <Progress value={(trip.paidAmount / trip.totalCost) * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
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
                  { icon: DollarSign, label: "Budget", value: "$2,450", color: "text-chart-2" },
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
                <h3 className="text-sm font-medium text-muted-foreground">Day 1 - Arrival</h3>
                {[
                  { time: "10:00 AM", task: "Arrive at Narita Airport", done: true },
                  { time: "12:00 PM", task: "Check-in at Park Hyatt", done: true },
                  { time: "3:00 PM", task: "Explore Shibuya Crossing", done: false },
                  { time: "7:00 PM", task: "Dinner at Ichiran Ramen", done: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-chart-3 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-muted-foreground w-20">{item.time}</span>
                    <span className={item.done ? "text-muted-foreground line-through" : "text-foreground"}>
                      {item.task}
                    </span>
                  </div>
                ))}
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
                <div className="text-3xl font-bold text-foreground">${totalSpent}</div>
                <div className="text-sm text-muted-foreground">of ${totalBudget} budget</div>
                <Progress value={(totalSpent / totalBudget) * 100} className="h-3 mt-3" />
              </div>

              <div className="space-y-3">
                {budgetCategories.map((cat, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{cat.name}</span>
                      <span className="text-foreground">
                        ${cat.spent} / ${cat.budget}
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
                      <div className="text-xs text-muted-foreground">From ${dest.price}</div>
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
