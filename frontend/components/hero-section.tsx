"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { Compass, Map, ArrowRight, Play, Star, Leaf, Loader2 } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, -150])

  const [destinations, setDestinations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("https://tourify-4euu.onrender.com/api/world/destinations")
        if (!res.ok) {
          console.error("Destinations API error:", res.status)
          setDestinations([])
          return
        }
        const data = await res.json()
        if (Array.isArray(data)) {
          setDestinations(data)
        } else {
          setDestinations([])
        }
      } catch (err) {
        console.error("Error fetching destinations:", err)
        setDestinations([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  const count = destinations.length
  let featured = [];
  if (Array.isArray(destinations)) {
    featured = destinations.slice(0, 2);
  } else {
    // Handle error or fallback
    featured = [];
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      {/* Nature Ambience - Soft Organic Blobs */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px] dark:bg-emerald-900/20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[120px] dark:bg-amber-900/10" />
        <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[100px] dark:bg-teal-900/10" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-emerald-500/10 text-foreground/80 text-sm font-medium"
          >
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span className="tracking-wide uppercase text-xs font-bold">Nature-Inspired Journey</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9]"
          >
            <span className="block text-foreground mb-2">Reconnect</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500">
              With Earth
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-foreground/70 max-w-2xl leading-relaxed font-normal"
          >
            Let AI breathe life into your next escape. Discover hidden sanctuaries where silence speaks louder than words and nature is your compass.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 w-full justify-center pt-8"
          >
            <Link href="/planner">
              <Button size="lg" className="h-14 px-10 rounded-full bg-primary text-primary-foreground hover:scale-105 transition-all duration-300 font-semibold text-lg hover:shadow-[0_10px_30px_-5px_rgba(var(--primary),0.4)]">
                Start Planning <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/destinations">
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-full border-foreground/20 hover:bg-foreground/5 text-foreground text-lg backdrop-blur-sm transition-all hover:scale-105 group">
                <Compass className="mr-2 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                View Trails
              </Button>
            </Link>
          </motion.div>

          {featured[0] && (
            <motion.div
              style={{ y: y1 }}
              className="absolute -left-16 top-48 hidden lg:block glass-card p-4 rounded-[2.5rem] rotate-[-8deg] max-w-[260px] border-emerald-500/10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            >
              <div className="flex flex-col gap-3">
                <div
                  className="h-40 rounded-[1.8rem] bg-cover bg-center relative overflow-hidden group"
                  style={{ backgroundImage: `url(${featured[0].image})` }}
                >
                  <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="px-2 pb-1">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">{featured[0].name.split(',')[0]}</div>
                    <div className="flex items-center text-xs text-amber-500 gap-1"><Star className="w-3 h-3 fill-current" /> {featured[0].rating}</div>
                  </div>
                  <div className="text-xs text-foreground/60 italic overflow-hidden text-ellipsis whitespace-nowrap">{featured[0].tag || featured[0].category}</div>
                </div>
              </div>
            </motion.div>
          )}

          {featured[1] && (
            <motion.div
              style={{ y: y2 }}
              className="absolute -right-16 bottom-32 hidden lg:block glass-card p-4 rounded-[2.5rem] rotate-[8deg] max-w-[260px] border-amber-500/10"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.7 }}
            >
              <div className="flex flex-col gap-3">
                <div
                  className="h-40 rounded-[1.8rem] bg-cover bg-center relative overflow-hidden group"
                  style={{ backgroundImage: `url(${featured[1].image})` }}
                >
                  <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="px-2 pb-1">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">{featured[1].name.split(',')[0]}</div>
                    <div className="flex items-center text-xs text-amber-500 gap-1"><Star className="w-3 h-3 fill-current" /> {featured[1].rating}</div>
                  </div>
                  <div className="text-xs text-foreground/60 italic overflow-hidden text-ellipsis whitespace-nowrap">{featured[1].tag || featured[1].category}</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

