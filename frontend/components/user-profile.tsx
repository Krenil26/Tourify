"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Shield,
  Bell,
  Settings,
  Edit3,
  CheckCircle2,
  Clock,
  XCircle,
  Plane,
  Hotel,
  Download,
  Star,
  Award,
  TrendingUp,
  Globe,
  Camera,
  Plus,
  Users,
  LogOut,
} from "lucide-react"

const bookings = [
  {
    id: "TRF-2026-001",
    destination: "Tokyo, Japan",
    image: "/tokyo-city-night-neon-lights-shibuya.jpg",
    dates: "Mar 15 - Mar 22, 2026",
    status: "confirmed",
    totalCost: 2450,
    type: "full-package",
    travelers: 2,
    items: [
      { type: "flight", name: "Round-trip Flight", details: "JFK → NRT", price: 850 },
      { type: "hotel", name: "Park Hyatt Tokyo", details: "7 nights", price: 1400 },
      { type: "activity", name: "Mt. Fuji Day Trip", details: "Mar 17", price: 200 },
    ],
  },
  {
    id: "TRF-2026-002",
    destination: "Bali, Indonesia",
    image: "/bali-tropical-beach-sunset-temple.jpg",
    dates: "May 10 - May 18, 2026",
    status: "pending",
    totalCost: 1800,
    type: "full-package",
    travelers: 4,
    items: [
      { type: "flight", name: "Round-trip Flight", details: "JFK → DPS", price: 720 },
      { type: "hotel", name: "Ubud Luxury Resort", details: "8 nights", price: 960 },
      { type: "activity", name: "Temple Tour", details: "May 12", price: 120 },
    ],
  },
  {
    id: "TRF-2025-089",
    destination: "Paris, France",
    image: "/paris-eiffel-tower-city-lights-romantic.jpg",
    dates: "Dec 20 - Dec 27, 2025",
    status: "completed",
    totalCost: 1899,
    type: "full-package",
    travelers: 2,
    items: [
      { type: "flight", name: "Round-trip Flight", details: "JFK → CDG", price: 650 },
      { type: "hotel", name: "Le Marais Hotel", details: "7 nights", price: 1100 },
      { type: "activity", name: "Louvre Tour", details: "Dec 22", price: 149 },
    ],
  },
]

const achievements = [
  { icon: Globe, title: "Globe Trotter", description: "Visited 5 countries", earned: true },
  { icon: Star, title: "Early Bird", description: "Booked 3 trips in advance", earned: true },
  { icon: Award, title: "Budget Master", description: "Saved 20% on average", earned: true },
  { icon: TrendingUp, title: "Rising Star", description: "Complete 10 trips", earned: false },
]

const travelStats = [
  { label: "Countries Visited", value: 8 },
  { label: "Total Trips", value: 12 },
  { label: "Miles Traveled", value: "45,230" },
  { label: "Money Saved", value: "$2,340" },
]

export function UserProfile() {
  const [activeTab, setActiveTab] = useState("bookings")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({
    name: "Explorer",
    email: "email@example.com",
    phone: "",
    location: ""
  })

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        const u = JSON.parse(stored)
        setUser({
          name: u.name || "Explorer",
          email: u.email || "",
          phone: u.phone || "",
          location: u.location || ""
        })
      } catch (e) { console.error("Error parsing user", e) }
    }
    setLoading(false)
  }, [])

  const [tempUser, setTempUser] = useState({ ...user })

  useEffect(() => {
    setTempUser({ ...user })
  }, [user])

  const handleSave = () => {
    setUser({ ...tempUser })
    setIsEditing(false)
    console.log("Profile updated:", tempUser)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-chart-3/20 text-chart-3 border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-chart-4/20 text-chart-4 border-0">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-muted text-muted-foreground border-0">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-destructive/20 text-destructive border-0">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        )
    }
  }

  return (
    <section className="min-h-screen pt-20 pb-12 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Profile Header */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8 mt-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-primary/20 flex items-center justify-center overflow-hidden border border-emerald-500/10 shadow-xl shadow-emerald-500/5">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg hover:scale-110">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{user.name}</h1>
                <Badge className="bg-emerald-500/20 text-emerald-500 border- emerald-500/10 w-fit backdrop-blur-md">
                  <Award className="w-3 h-3 mr-1" />
                  Gold Member
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className={`border-border rounded-xl px-6 h-11 transition-all ${isEditing ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-transparent hover:bg-primary/5 hover:border-primary/30'}`}
                onClick={() => {
                  setIsEditing(!isEditing)
                  setActiveTab("settings")
                }}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? "Editing Mode" : "Edit Profile"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`border-border rounded-xl w-11 h-11 transition-all ${activeTab === 'settings' ? 'bg-primary/10 text-primary border-primary/30 shadow-inner shadow-primary/5' : 'bg-transparent'}`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Travel Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-emerald-500/5">
            {travelStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 group-hover:scale-110 transition-transform duration-300 inline-block">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider text-[10px] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-card p-1.5 h-auto flex-wrap gap-1 border-emerald-500/5">
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-8 py-3.5 transition-all text-sm font-bold"
            >
              <Calendar className="w-4 h-4 mr-2" />
              My Bookings
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-8 py-3.5 transition-all text-sm font-bold"
            >
              <Award className="w-4 h-4 mr-2" />
              Milestones
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl px-8 py-3.5 transition-all text-sm font-bold"
            >
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="glass-card rounded-3xl overflow-hidden border-emerald-500/5 hover:border-emerald-500/20 transition-all group">
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
                  <div className="lg:w-64 h-56 lg:h-auto relative overflow-hidden">
                    <img
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.destination}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-foreground tracking-tight group-hover:text-emerald-500 transition-colors">{booking.destination}</h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="flex flex-wrap gap-6 text-[13px] text-muted-foreground font-medium">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            {booking.dates}
                          </span>
                          <span className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-500" />
                            {booking.travelers} travelers
                          </span>
                          <span className="text-[11px] bg-secondary px-2 py-0.5 rounded-md self-center">ID: {booking.id}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-extrabold text-foreground">${booking.totalCost}</div>
                        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1 text-emerald-600/60">Total Budget</div>
                      </div>
                    </div>

                    {/* Booking Items */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-8">
                      {booking.items.map((item, index) => (
                        <div key={index} className="bg-foreground/[0.02] border border-foreground/[0.03] rounded-2xl p-4 flex items-center gap-4 hover:bg-emerald-500/[0.03] hover:border-emerald-500/10 transition-all">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.type === "flight" ? "bg-blue-500/10 text-blue-500" :
                            item.type === "hotel" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                            }`}>
                            {item.type === "flight" ? <Plane className="w-5 h-5" /> :
                              item.type === "hotel" ? <Hotel className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-foreground mb-0.5">{item.name}</div>
                            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.details}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-emerald-500/5">
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="rounded-xl border-border bg-transparent hover:bg-foreground/5 font-bold h-10 px-5 text-xs uppercase tracking-widest">
                          <Download className="w-4 h-4 mr-2" />
                          Receipt
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl border-border bg-transparent hover:bg-foreground/5 font-bold h-10 px-5 text-xs uppercase tracking-widest border-emerald-500/20 text-emerald-500">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Modify
                        </Button>
                      </div>
                      <Link href="/planner">
                        <Button className="rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 font-bold h-10 px-6 text-xs uppercase tracking-widest">
                          Explore Guide
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Milestone/Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`glass-card rounded-[2.5rem] p-8 text-center transition-all duration-500 hover:scale-105 border-emerald-500/5 ${!achievement.earned ? "opacity-40 grayscale" : "bg-gradient-to-b from-emerald-500/[0.03] to-transparent border-emerald-500/10 shadow-xl shadow-emerald-500/5"}`}
                >
                  <div
                    className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center relative ${achievement.earned ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30" : "bg-secondary"
                      }`}
                  >
                    <achievement.icon
                      className={`w-10 h-10 ${achievement.earned ? "text-white" : "text-muted-foreground"}`}
                    />
                    {achievement.earned && <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center border-4 border-background"><CheckCircle2 className="w-3 h-3 text-white" /></div>}
                  </div>
                  <h3 className="font-bold text-foreground mb-2 text-lg">{achievement.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed px-4">{achievement.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="glass-card rounded-3xl p-8 border-emerald-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <User className="w-32 h-32 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><User className="w-4 h-4 text-emerald-500" /></div>
                  Personal Details
                </h3>
                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                    <Input
                      value={tempUser.name}
                      onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                      className="bg-foreground/[0.03] border-foreground/5 h-12 rounded-xl focus:ring-emerald-500/20 text-sm font-medium"
                      disabled={!isEditing}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                    <Input
                      value={tempUser.email}
                      onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                      className="bg-foreground/[0.03] border-foreground/5 h-12 rounded-xl focus:ring-emerald-500/20 text-sm font-medium"
                      disabled={!isEditing}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Phone</label>
                      <Input
                        value={tempUser.phone}
                        onChange={(e) => setTempUser({ ...tempUser, phone: e.target.value })}
                        className="bg-foreground/[0.03] border-foreground/5 h-12 rounded-xl focus:ring-emerald-500/20 text-sm font-medium"
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Base Location</label>
                      <Input
                        value={tempUser.location}
                        onChange={(e) => setTempUser({ ...tempUser, location: e.target.value })}
                        className="bg-foreground/[0.03] border-foreground/5 h-12 rounded-xl focus:ring-emerald-500/20 text-sm font-medium"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSave} className="flex-1 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl h-12 font-bold shadow-lg shadow-emerald-500/20">
                        Update Identity
                      </Button>
                      <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl h-12 px-6">Cancel</Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Preferences */}
              <div className="glass-card rounded-3xl p-8 border-emerald-500/5">
                <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Bell className="w-4 h-4 text-emerald-500" /></div>
                  Preferences
                </h3>
                <div className="space-y-2">
                  {[
                    { title: "Smart Price Alerts", description: "Real-time updates on trail pricing" },
                    { title: "Booking Confirmation", description: "Email & App direct notifications" },
                    { title: "AI Travel Tips", description: "Personalized suggestions for your next trip" },
                    { title: "Eco-Guardian Updates", description: "Environmental status of saved trails" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 border-b border-foreground/5 uppercase last:border-0 hover:bg-emerald-500/[0.01] transition-colors rounded-lg px-2"
                    >
                      <div className="max-w-[70%]">
                        <div className="text-xs font-bold text-foreground mb-1 tracking-tight">{item.title}</div>
                        <div className="text-[10px] text-muted-foreground font-medium">{item.description}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-5 bg-foreground/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security & Access */}
              <div className="glass-card rounded-3xl p-8 border-emerald-500/5 lg:col-span-2">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Shield className="w-4 h-4 text-emerald-500" /></div>
                      Vault Security
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-14 rounded-2xl border-emerald-500/10 bg-emerald-500/5 text-foreground hover:bg-emerald-500/10 justify-start px-6 font-bold group">
                        <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><Clock className="w-4 h-4" /></div>
                        Rotate Password
                      </Button>
                      <Button variant="outline" className="h-14 rounded-2xl border-emerald-500/10 bg-emerald-500/5 text-foreground hover:bg-emerald-500/10 justify-start px-6 font-bold group">
                        <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><Shield className="w-4 h-4" /></div>
                        Biometric Access
                      </Button>
                    </div>
                  </div>
                  <div className="md:w-px bg-emerald-500/10" />
                  <div className="flex-1 flex flex-col justify-end gap-3">
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed italic">
                      "Your data is protected by Tourify's Earth Guardian protocol, ensuring your travel footprint is private and secure."
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link href="/login" className="flex-1">
                        <Button variant="outline" className="w-full text-foreground hover:bg-foreground/5 font-bold rounded-xl h-11 px-6 text-[10px] uppercase tracking-widest border border-border">
                          <LogOut className="w-4 h-4 mr-2" />
                          Log Out of Tourify
                        </Button>
                      </Link>
                      <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive font-bold rounded-xl h-11 px-6 text-[10px] uppercase tracking-widest border border-destructive/10">
                        Remove My Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
