"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Send,
  Bot,
  User,
  Plane,
  Hotel,
  Utensils,
  Camera,
  Clock,
  ChevronRight,
  Heart,
  Mountain,
  Palmtree,
  Building,
  Tent,
  Music,
  ShoppingBag,
} from "lucide-react"

const travelStyles = [
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "relaxation", label: "Relaxation", icon: Palmtree },
  { id: "cultural", label: "Cultural", icon: Building },
  { id: "nature", label: "Nature", icon: Tent },
  { id: "nightlife", label: "Nightlife", icon: Music },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
]

const sampleItinerary = [
  {
    day: 1,
    title: "Arrival & Old Delhi Exploration",
    activities: [
      { time: "10:00 AM", activity: "Arrive at Delhi Airport", icon: Plane, cost: 0 },
      { time: "12:00 PM", activity: "Check-in at Hotel Taj Palace", icon: Hotel, cost: 150 },
      { time: "2:00 PM", activity: "Explore Chandni Chowk Market", icon: Camera, cost: 20 },
      { time: "7:00 PM", activity: "Street Food Tour", icon: Utensils, cost: 30 },
    ],
  },
  {
    day: 2,
    title: "Iconic Monuments Day",
    activities: [
      { time: "8:00 AM", activity: "Visit Red Fort", icon: Camera, cost: 15 },
      { time: "11:00 AM", activity: "Jama Masjid Tour", icon: Building, cost: 10 },
      { time: "1:00 PM", activity: "Lunch at Karim's", icon: Utensils, cost: 25 },
      { time: "4:00 PM", activity: "India Gate & Rashtrapati Bhavan", icon: Camera, cost: 0 },
    ],
  },
  {
    day: 3,
    title: "Day Trip to Agra",
    activities: [
      { time: "6:00 AM", activity: "Train to Agra", icon: Plane, cost: 40 },
      { time: "9:00 AM", activity: "Taj Mahal Sunrise Visit", icon: Camera, cost: 20 },
      { time: "12:00 PM", activity: "Agra Fort Exploration", icon: Building, cost: 15 },
      { time: "6:00 PM", activity: "Return to Delhi", icon: Plane, cost: 40 },
    ],
  },
]

interface Message {
  role: "user" | "ai"
  content: string
}

export function AIPlannerInterface() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [destination, setDestination] = useState("")
  const [dates, setDates] = useState({ start: "", end: "" })
  const [travelers, setTravelers] = useState(2)
  const [budget, setBudget] = useState([2000])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [showItinerary, setShowItinerary] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeDestinationData, setActiveDestinationData] = useState<any>(null)
  const [customItinerary, setCustomItinerary] = useState<any[]>([])

  // Load destination from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const dest = params.get("destination")
    if (dest) {
      setDestination(dest)
      fetchDestinationData(dest)
    }
  }, [])

  const fetchDestinationData = async (name: string) => {
    try {
      const res = await fetch(`https://tourify-4cuu.onrender.com/api/world/destinations`)
      const data = await res.json()
      const found = data.find((d: any) => d.name.toLowerCase().includes(name.toLowerCase()))
      if (found) setActiveDestinationData(found)
    } catch (err) {
      console.error("Error fetching destination data:", err)
    }
  }

  const toggleStyle = (styleId: string) => {
    setSelectedStyles((prev) => (prev.includes(styleId) ? prev.filter((s) => s !== styleId) : [...prev, styleId]))
  }

  const generateTrip = async () => {
    setIsGenerating(true)

    // Calculate dynamic days based on dates
    let diffDays = 3
    if (dates.start && dates.end) {
      const start = new Date(dates.start)
      const end = new Date(dates.end)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    }
    // Safety cap: min 1 day, max 14 days
    diffDays = Math.min(Math.max(diffDays, 1), 14)

    setMessages([
      {
        role: "ai",
        content: `Analyzing ${destination || "your destination"}... Connecting with local spirits and checking available trails for a ${diffDays}-day journey.`,
      },
    ])

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Build a semi-dynamic itinerary
    const accommodation = activeDestinationData?.accommodations?.[0]?.name || "Luxury Eco Lodge"
    const rental = activeDestinationData?.rentals?.[0]?.name || "Eco-Friendly SUV"

    const generatedItinerary = []
    for (let i = 1; i <= diffDays; i++) {
      const currentDate = dates.start ? new Date(dates.start) : new Date()
      if (dates.start) currentDate.setDate(currentDate.getDate() + (i - 1))
      const dateStr = dates.start
        ? currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : ""

      let title = ""
      let activities = []

      const dest = destination || "your destination"

      if (i === 1) {
        title = `Arrival in ${dest}`
        activities = [
          { time: "10:00 AM", activity: `Arrive at ${dest} Airport / Station`, icon: Plane, cost: 50 },
          { time: "12:00 PM", activity: `Check-in at ${accommodation}`, icon: Hotel, cost: 0 },
          { time: "2:00 PM", activity: `Explore nearby landmarks of ${dest}`, icon: Camera, cost: 0 },
          { time: "7:00 PM", activity: `Welcome dinner – Local cuisine of ${dest}`, icon: Utensils, cost: 40 },
        ]
      } else if (i === diffDays && diffDays > 1) {
        title = `Farewell & Departure from ${dest}`
        activities = [
          { time: "9:00 AM", activity: `Last morning walk around ${dest}`, icon: Camera, cost: 0 },
          { time: "11:00 AM", activity: `Souvenir shopping at local market`, icon: ShoppingBag, cost: 30 },
          { time: "1:00 PM", activity: `Farewell brunch`, icon: Utensils, cost: 35 },
          { time: "4:00 PM", activity: `Transfer to ${dest} Airport / Station – Departure`, icon: Plane, cost: 40 },
        ]
      } else {
        const middleThemes = [
          { title: `Nature & Scenic Spots in ${dest}`, activities: [
            { time: "8:00 AM", activity: `Guided nature trail & scenic viewpoints`, icon: Tent, cost: 25 },
            { time: "12:00 PM", activity: `Lunch at a popular local restaurant`, icon: Utensils, cost: 30 },
            { time: "2:00 PM", activity: `Visit parks, gardens & natural attractions`, icon: Camera, cost: 15 },
            { time: "7:00 PM", activity: `Sunset point & dinner`, icon: Utensils, cost: 40 },
          ]},
          { title: `Cultural Heritage of ${dest}`, activities: [
            { time: "9:00 AM", activity: `Visit historical monuments & temples`, icon: Building, cost: 20 },
            { time: "12:00 PM", activity: `Traditional lunch experience`, icon: Utensils, cost: 25 },
            { time: "2:00 PM", activity: `Museum & art gallery tour`, icon: Camera, cost: 15 },
            { time: "7:00 PM", activity: `Cultural show & local dinner`, icon: Utensils, cost: 45 },
          ]},
          { title: `Adventure Day in ${dest}`, activities: [
            { time: "7:00 AM", activity: `Trekking / off-road adventure activity`, icon: Mountain, cost: 50 },
            { time: "12:00 PM", activity: `Picnic lunch at adventure site`, icon: Utensils, cost: 20 },
            { time: "3:00 PM", activity: `Water sports / zip-lining / cycling`, icon: Sparkles, cost: 40 },
            { time: "8:00 PM", activity: `Campfire dinner & stargazing`, icon: Utensils, cost: 35 },
          ]},
          { title: `Relaxation & Local Life in ${dest}`, activities: [
            { time: "10:00 AM", activity: `Spa & wellness retreat`, icon: Sparkles, cost: 60 },
            { time: "1:00 PM", activity: `Farm-to-table lunch experience`, icon: Utensils, cost: 30 },
            { time: "3:00 PM", activity: `Local village walk & interaction`, icon: Building, cost: 0 },
            { time: "7:00 PM", activity: `Rooftop dinner with city views`, icon: Utensils, cost: 50 },
          ]},
        ]
        const theme = middleThemes[(i - 2) % middleThemes.length]
        title = theme.title
        activities = theme.activities
      }

      generatedItinerary.push({
        day: i,
        date: dateStr,
        title,
        activities
      })
    }

    setCustomItinerary(generatedItinerary)
    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        content: `I've crafted a unique ${diffDays}-day itinerary for ${destination}! I've included ${accommodation} and suggested using ${rental} for your local travels to stay eco-friendly and stylish.`,
      },
    ])

    setShowItinerary(true)
    setIsGenerating(false)
    setStep(4)
  }

  const handleBookTrip = () => {
    const bookingData = {
      destination,
      travelers,
      budget: budget[0],
      styles: selectedStyles,
      itinerary: customItinerary,
      startDate: dates.start,
      endDate: dates.end
    }
    sessionStorage.setItem("pending_booking", JSON.stringify(bookingData))
    router.push("/booking")
  }

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    setMessages((prev) => [...prev, { role: "user", content: inputMessage }])

    // Simulate smarter AI response based on current data
    setTimeout(() => {
      let response = "I've updated your preferences! Should I look for more budget-friendly options or upscale experiences?"
      if (inputMessage.toLowerCase().includes("hotel") || inputMessage.toLowerCase().includes("stay")) {
        response = `I can suggest other accommodations like ${activeDestinationData?.accommodations?.[1]?.name || "the local Boutique Villas"}. Would you like to swap?`
      } else if (inputMessage.toLowerCase().includes("car") || inputMessage.toLowerCase().includes("ride")) {
        response = `Instead of the ${activeDestinationData?.rentals?.[0]?.name}, we could go with a ${activeDestinationData?.rentals?.[1]?.name || "private chauffeur"}.`
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: response,
        },
      ])
    }, 1000)

    setInputMessage("")
  }

  return (
    <section className="min-h-screen pt-20 pb-12 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI Trip Planner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Plan Your Perfect Trip with <span className="text-primary text-glow">AI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us your preferences and let our AI create a personalized, budget-optimized itinerary just for you
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 sm:w-20 h-1 mx-2 rounded-full transition-all ${step > s ? "bg-primary" : "bg-secondary"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input Form */}
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Where do you want to go?</h2>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Enter destination (e.g., Delhi, India)"
                    className="pl-12 h-14 bg-secondary border-0 text-foreground placeholder:text-muted-foreground rounded-xl"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>

                {/* Quick Suggestions */}
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Popular destinations:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Delhi, India", "Bali, Indonesia", "Tokyo, Japan", "Paris, France"].map((dest) => (
                      <Badge
                        key={dest}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5 border-border"
                        onClick={() => setDestination(dest)}
                      >
                        {dest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-12 h-14 bg-secondary border-0 text-foreground rounded-xl"
                      value={dates.start}
                      onChange={(e) => setDates({ ...dates, start: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="date"
                      className="pl-12 h-14 bg-secondary border-0 text-foreground rounded-xl"
                      value={dates.end}
                      onChange={(e) => setDates({ ...dates, end: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-semibold glow-cyan"
                  onClick={() => setStep(2)}
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Trip Details</h2>

                {/* Travelers */}
                <div>
                  <label className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Number of Travelers
                  </label>
                  <div className="flex items-center gap-4 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-xl border-border bg-transparent"
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    >
                      -
                    </Button>
                    <span className="text-2xl font-bold text-foreground w-12 text-center">{travelers}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-xl border-border bg-transparent"
                      onClick={() => setTravelers(travelers + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Budget per Person
                  </label>
                  <div className="mt-4">
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      max={10000}
                      min={500}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-muted-foreground">₹5,000</span>
                      <span className="text-lg font-bold text-primary">₹{budget[0]}</span>
                      <span className="text-sm text-muted-foreground">₹1,00,000</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-14 rounded-xl border-border bg-transparent"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-semibold glow-cyan"
                    onClick={() => setStep(3)}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">What's your travel style?</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {travelStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => toggleStyle(style.id)}
                      className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${selectedStyles.includes(style.id)
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-secondary border-border text-muted-foreground hover:border-primary/50"
                        }`}
                    >
                      <style.icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{style.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-14 rounded-xl border-border bg-transparent"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-semibold glow-cyan"
                    onClick={generateTrip}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Trip
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground mb-4">Chat with AI</h2>

                {/* Chat Messages */}
                <div className="h-[300px] overflow-y-auto space-y-4 pr-2">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-chart-2/20" : "bg-primary/20"
                          }`}
                      >
                        {msg.role === "user" ? (
                          <User className="w-4 h-4 text-chart-2" />
                        ) : (
                          <Bot className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl p-4 max-w-[85%] ${msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-secondary text-foreground rounded-bl-sm"
                          }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Input
                    placeholder="Ask AI to modify your itinerary..."
                    className="flex-1 h-12 bg-secondary border-0 text-foreground placeholder:text-muted-foreground rounded-xl"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button
                    size="icon"
                    className="h-12 w-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                    onClick={sendMessage}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Itinerary Preview */}
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            {!showItinerary ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 animate-pulse-glow">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Your Itinerary Preview</h3>
                <p className="text-muted-foreground max-w-sm">
                  Complete the steps on the left and our AI will generate a personalized travel itinerary for you
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative h-40 rounded-xl overflow-hidden mb-6">
                  <img
                    src={activeDestinationData?.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"}
                    alt={destination}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{destination || "Your Destination"}</h3>
                    <p className="text-xs text-white/80 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {activeDestinationData?.country || "Earth"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {customItinerary.length} Days • {travelers} Travelers • ₹{budget[0]} Budget
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>

                {/* Budget Breakdown */}
                <div className="glass-card rounded-xl p-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Budget Breakdown</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Flights", value: "₹45,000", percent: 40 },
                      { label: "Hotels", value: "₹35,000", percent: 30 },
                      { label: "Activities", value: "₹15,000", percent: 15 },
                      { label: "Food", value: "₹15,000", percent: 15 },
                    ].map((item, i) => (
                      <div key={i} className="text-center">
                        <div className="text-lg font-bold text-primary">{item.value}</div>
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="w-full h-1.5 bg-secondary rounded-full mt-2">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${item.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {customItinerary.map((day: any, dayIndex: number) => (
                    <div key={dayIndex} className="glass-card rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {day.day}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-foreground">Day {day.day}</h4>
                            {day.date && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-medium">{day.date}</span>}
                          </div>
                          <p className="text-sm text-muted-foreground">{day.title}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {day.activities.map((activity: any, actIndex: number) => (
                          <div key={actIndex} className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                              <activity.icon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{activity.time}</span>
                              </div>
                              <p className="text-foreground">{activity.activity}</p>
                            </div>
                            {activity.cost > 0 && <span className="text-primary font-medium">₹{activity.cost}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-semibold glow-cyan"
                  onClick={handleBookTrip}
                >
                  Book This Trip
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
