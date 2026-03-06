"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Heart, Plane, Calendar, Sparkles, Globe, X, SlidersHorizontal, Hotel, Car, Bike, LayoutGrid, Map as MapIcon } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

// Dynamically import the Real Map to handle window-dependent libraries in Next.js
const RealMapView = dynamic(() => import("./real-map-view"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[2/1] bg-emerald-950/20 rounded-[2rem] flex items-center justify-center border border-emerald-500/10">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Loading Earth data...</p>
      </div>
    </div>
  )
})

// Static data removed, now fetching from backend

const categories = ["All", "Beach", "City", "Romantic", "Luxury", "Adventure", "Culture"]
const priceRanges = ["All Prices", "Under ₹5000", "₹5000 - ₹15000", "₹15000 - ₹30000", "Above ₹30000"]

export function DestinationsExplorer() {
  const [items, setItems] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"destinations" | "trails">("destinations")
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPrice, setSelectedPrice] = useState("All Prices")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const endpoint = activeTab === "destinations" ? 'destinations' : 'trails'
        const response = await fetch(`https://tourify-4cuu.onrender.com/api/world/${endpoint}`)
        const data = await response.json()
        setItems(data)
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [activeTab])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.country || item.location).toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "trails") return matchesSearch // Trails don't have categories/prices yet

    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesPrice =
      selectedPrice === "All Prices" ||
      (selectedPrice === "Under ₹5000" && item.price < 5000) ||
      (selectedPrice === "₹5000 - ₹15000" && item.price >= 5000 && item.price <= 15000) ||
      (selectedPrice === "₹15000 - ₹30000" && item.price >= 15000 && item.price <= 30000) ||
      (selectedPrice === "Above ₹30000" && item.price > 30000)

    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "price-low") return (a.price || 0) - (b.price || 0)
    if (sortBy === "price-high") return (b.price || 0) - (a.price || 0)
    if (sortBy === "rating") return b.rating - a.rating
    return (b.reviews || 0) - (a.reviews || 0) // popular
  })

  return (
    <section className="min-h-screen pt-20 pb-12 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Tabs and Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex p-1 bg-secondary rounded-2xl mb-8">
            <button
              onClick={() => setActiveTab("destinations")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "destinations" ? "bg-primary text-primary-foreground shadow-lg glow-cyan" : "text-muted-foreground hover:text-foreground"}`}
            >
              Destinations
            </button>
            <button
              onClick={() => setActiveTab("trails")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "trails" ? "bg-primary text-primary-foreground shadow-lg glow-cyan" : "text-muted-foreground hover:text-foreground"}`}
            >
              Nature Trails
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover {activeTab === "destinations" ? "Destinations" : "Wild Trails"} with <span className="text-primary text-glow">AI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {activeTab === "destinations"
              ? "Explore handpicked destinations with AI-powered recommendations based on your preferences"
              : "Discover the world's most breathtaking nature paths, from alpine peaks to coastal cliffs."}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search destinations, countries..."
                className="pl-12 h-14 bg-secondary border-0 text-foreground placeholder:text-muted-foreground rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              className="lg:hidden h-14 border-border bg-transparent"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
            </Button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-secondary p-1 rounded-xl mr-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === "map" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <MapIcon className="w-5 h-5" />
                </button>
              </div>

              <select
                className="h-14 px-4 bg-secondary border-0 text-foreground rounded-xl outline-none cursor-pointer"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              >
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>

              <select
                className="h-14 px-4 bg-secondary border-0 text-foreground rounded-xl outline-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <Link href="/planner">
                <Button className="h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 glow-cyan">
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI Planner
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-border space-y-4">
              <div className="flex gap-2">
                <select
                  className="flex-1 h-12 px-4 bg-secondary border-0 text-foreground rounded-xl outline-none"
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                >
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                <select
                  className="flex-1 h-12 px-4 bg-secondary border-0 text-foreground rounded-xl outline-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}

          {/* Category Tabs */}
          {activeTab === "destinations" && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="text-foreground font-medium">{sortedItems.length}</span> {activeTab}
          </p>
          {(selectedCategory !== "All" || selectedPrice !== "All Prices" || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSelectedCategory("All")
                setSelectedPrice("All Prices")
                setSearchQuery("")
              }}
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* View Content */}
        {viewMode === "map" ? (
          <div className="mb-12">
            <RealMapView destinations={sortedItems} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full py-20 text-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground uppercase tracking-widest text-xs animate-pulse">Syncing with nature's pulse...</p>
              </div>
            ) : sortedItems.map((item) => (
              <div
                key={item.id}
                className="group glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all shadow-xl hover:shadow-primary/5"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {(item.tags || []).slice(0, 2).map((tag: string, i: number) => (
                      <Badge key={i} className="bg-primary/20 backdrop-blur-md text-primary-foreground border-primary/20 text-[10px] py-0">
                        {tag}
                      </Badge>
                    ))}
                    {activeTab === 'trails' && (
                      <Badge className={`${item.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'} border-none text-[10px] py-0`}>
                        {item.difficulty}
                      </Badge>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md ${favorites.includes(item.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-black/20 text-white/70 hover:text-white"
                      }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorites.includes(item.id) ? "fill-current" : ""}`} />
                  </button>

                  {/* Rating/Stats */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/10">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-xs font-bold text-white">{item.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-base line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{item.country || item.location}</span>
                      </div>
                    </div>
                    {item.price && (
                      <div className="text-right">
                        <span className="text-base font-black text-primary">₹{item.price}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed h-8">{item.description}</p>

                  {/* Trail Stats or Travel Info */}
                  {activeTab === 'trails' ? (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-secondary/50 rounded-lg p-2 border border-border/50">
                        <div className="text-[9px] uppercase text-muted-foreground font-bold">Distance</div>
                        <div className="text-xs font-bold text-foreground">{item.distance}</div>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-2 border border-border/50">
                        <div className="text-[9px] uppercase text-muted-foreground font-bold">Elevation</div>
                        <div className="text-xs font-bold text-foreground">{item.elevationGain}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-4 font-medium bg-secondary/30 p-2 rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-primary" />
                        <span>{item.bestTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Plane className="w-3 h-3 text-primary" />
                        <span>{item.flightTime}</span>
                      </div>
                    </div>
                  )}

                  <Link href={`/planner?${activeTab === 'destinations' ? 'destination' : 'trail'}=${encodeURIComponent(item.name)}`}>
                    <Button variant="outline" className="w-full border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all rounded-xl h-10 text-xs font-bold uppercase tracking-widest">
                      {activeTab === 'destinations' ? 'Plan Adventure' : 'Start Journey'}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {sortedItems.length === 0 && (
          <div className="text-center py-20 bg-secondary/20 rounded-[3rem] border border-dashed border-border mb-12">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No results discovered</h3>
            <p className="text-muted-foreground mb-8">Try expanding your search or clearing filters.</p>
            <Button
              variant="default"
              className="bg-primary text-primary-foreground rounded-full px-8"
              onClick={() => {
                setSelectedCategory("All")
                setSelectedPrice("All Prices")
                setSearchQuery("")
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
