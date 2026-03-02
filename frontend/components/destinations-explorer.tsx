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
const priceRanges = ["All Prices", "Under $1000", "$1000 - $1500", "$1500 - $2000", "Above $2000"]

export function DestinationsExplorer() {
  const [destinations, setDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPrice, setSelectedPrice] = useState("All Prices")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('https://tourify-backend-99ef.onrender.com/api/world/destinations')
        const data = await response.json()
        setDestinations(data)
      } catch (error) {
        console.error("Error fetching destinations:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || dest.category === selectedCategory
    const matchesPrice =
      selectedPrice === "All Prices" ||
      (selectedPrice === "Under $1000" && dest.price < 1000) ||
      (selectedPrice === "$1000 - $1500" && dest.price >= 1000 && dest.price <= 1500) ||
      (selectedPrice === "$1500 - $2000" && dest.price >= 1500 && dest.price <= 2000) ||
      (selectedPrice === "Above $2000" && dest.price > 2000)

    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "rating") return b.rating - a.rating
    return b.reviews - a.reviews // popular
  })

  return (
    <section className="min-h-screen pt-20 pb-12 relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Explore Destinations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Discover Your Next <span className="text-primary text-glow">Adventure</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore handpicked destinations with AI-powered recommendations based on your preferences
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
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="text-foreground font-medium">{sortedDestinations.length}</span> destinations
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
            <RealMapView destinations={sortedDestinations} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full py-20 text-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Connecting to the spirits of the world...</p>
              </div>
            ) : sortedDestinations.map((dest) => (
              <div
                key={dest._id}
                className="group glass-card rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image || "/placeholder.svg"}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                  {/* Tags */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {dest.tags.slice(0, 2).map((tag: string, i: number) => (
                      <Badge key={i} className="bg-primary/90 text-primary-foreground text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(dest._id)}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${favorites.includes(dest._id)
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-secondary/80 text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(dest._id) ? "fill-current" : ""}`} />
                  </button>

                  {/* Rating */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-secondary/80 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="text-sm font-medium text-foreground">{dest.rating}</span>
                    <span className="text-xs text-muted-foreground">({dest.reviews})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {dest.name}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="w-3 h-3" />
                        <span>{dest.country}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">${dest.price}</span>
                      <div className="text-xs text-muted-foreground">per person</div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{dest.description}</p>

                  {/* Info Pills */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{dest.bestTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Plane className="w-3 h-3" />
                      <span>{dest.flightTime}</span>
                    </div>
                  </div>

                  {/* Essentials Section */}
                  {(dest.accommodations?.length > 0 || dest.rentals?.length > 0) && (
                    <div className="pt-4 mt-4 border-t border-border space-y-3 mb-4">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Trip Essentials</div>
                      {dest.accommodations?.[0] && (
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Hotel className="w-3.5 h-3.5 text-primary" />
                            <span className="truncate max-w-[120px]">{dest.accommodations[0].name}</span>
                          </div>
                          <span className="font-semibold text-foreground">${dest.accommodations[0].pricePerNight}/nt</span>
                        </div>
                      )}
                      {dest.rentals?.[0] && (
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            {dest.rentals[0].vehicleType === 'Bike' ? <Bike className="w-3.5 h-3.5 text-primary" /> : <Car className="w-3.5 h-3.5 text-primary" />}
                            <span className="truncate max-w-[120px]">{dest.rentals[0].name}</span>
                          </div>
                          <span className="font-semibold text-foreground">${dest.rentals[0].pricePerDay}/day</span>
                        </div>
                      )}
                    </div>
                  )}

                  <Link href={`/planner?destination=${encodeURIComponent(dest.name)}`}>
                    <Button className="w-full bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                      Plan Trip
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {sortedDestinations.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No destinations found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
            <Button
              variant="outline"
              className="border-border bg-transparent"
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
