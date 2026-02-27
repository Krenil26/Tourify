"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, MapPin, TrendingUp, Heart, Loader2 } from "lucide-react"
import Link from "next/link"

export function DestinationsPreview() {
  const [destinations, setDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/world/destinations")
        if (!res.ok) {
          console.error("Destinations API error:", res.status)
          setDestinations([])
          return
        }
        const data = await res.json()
        // Randomly pick top 4 for preview
        if (Array.isArray(data)) {
          setDestinations(data.slice(0, 4));
        } else {
          // Handle error or fallback
          setDestinations([]);
          console.error('API did not return an array:', data);
        }
      } catch (err) {
        console.error("Error fetching destinations:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  const tags = ["Trending", "Popular", "Adventure", "Luxury"]
  const tagColors = [
    "from-emerald-500 to-teal-400",
    "from-amber-500 to-orange-400",
    "from-blue-500 to-indigo-400",
    "from-rose-500 to-pink-400"
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-600 uppercase tracking-tighter">Live Trails</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Curated <span className="text-emerald-500">Nature Escapes</span>
            </h2>
          </div>
          <Link href="/destinations">
            <Button className="rounded-full px-8 h-12 bg-primary text-primary-foreground hover:scale-105 transition-all shadow-xl shadow-primary/20">
              Explore All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Scanning the globe for trails...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <div key={dest._id} className="group cursor-pointer relative">
                <Link href={`/destinations`}>
                  <div className="relative rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-2xl transition-all duration-500 group-hover:shadow-emerald-500/20 group-hover:-translate-y-2 border border-foreground/5">
                    <img
                      src={dest.image || "/placeholder.svg"}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                    {/* Floating Badge */}
                    <div className="absolute top-5 left-5">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold bg-gradient-to-r ${tagColors[index % tagColors.length]} text-white shadow-lg backdrop-blur-md uppercase tracking-wide`}
                      >
                        {dest.category || tags[index % tags.length]}
                      </span>
                    </div>

                    {/* Heart Button */}
                    <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20 z-20">
                      <Heart className="w-5 h-5 text-white" />
                    </button>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 transform transition-transform duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold text-white">{dest.rating}</span>
                        </div>
                        <span className="text-[10px] text-white/60 font-medium">Verified Trail</span>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{dest.name.split(',')[0]}</h3>
                      <p className="text-white/60 text-xs mb-4 line-clamp-1">{dest.country}</p>

                      <div className="flex items-center justify-between mt-auto border-t border-white/10 pt-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Starts at</span>
                          <span className="text-xl font-black text-white">${dest.price}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
