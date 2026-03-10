"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Compass, Leaf, Shield, Globe, Users, TreeDeciduous, Bird, Cloud, Loader2 } from "lucide-react"
import Link from "next/link"

const IconMap: { [key: string]: any } = {
  Leaf,
  Compass,
  Cloud,
  Globe,
  Users,
  Bird,
  Shield,
  TreeDeciduous
}

export function FeaturesSection() {
  const [features, setFeatures] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await fetch("https://tourify-4cuu.onrender.com/api/features")
        if (!res.ok) {
          console.error("Features API error:", res.status)
          setFeatures([])
          return
        }
        const data = await res.json()
        if (Array.isArray(data)) {
          setFeatures(data)
        } else {
          setFeatures([])
        }
      } catch (err) {
        console.error("Error fetching features:", err)
        setFeatures([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatures()
  }, [])

  if (isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <div className="container px-4 md:px-6 relative">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Harmony with <span className="text-nature-gradient">Technology</span>
          </motion.h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
            Sustainable exploration powered by intelligence, designed for those who seek the extraordinary in the natural world.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 h-full md:h-[600px] min-h-[500px]">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = IconMap[feature.iconName] || Leaf

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex-grow h-full"
      style={{ flexBasis: "0%" }}
      animate={{
        flexGrow: isHovered ? 4 : 1,
      }}
    >
      <Link href={feature.link || "/planner"} className="block h-full">
        <div className={`relative h-full overflow-hidden rounded-[2.5rem] p-8 transition-all duration-700 bg-white/5 backdrop-blur-md border border-foreground/5 shadow-2xl group`}>
          {/* Animated Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 group-hover:opacity-100 transition-opacity duration-700`} />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-40 transition-opacity duration-700" />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <motion.div
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  rotate: isHovered ? 12 : 0,
                  backgroundColor: isHovered ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.05)"
                }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors"
              >
                <Icon className="w-8 h-8 text-emerald-400" />
              </motion.div>

              <h3 className={`text-2xl md:text-3xl font-bold mb-4 text-white transition-all duration-500 ${!isHovered ? "md:[writing-mode:vertical-lr] md:rotate-180" : ""}`}>
                {feature.title}
              </h3>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20,
                display: isHovered ? "block" : "none"
              }}
              transition={{ duration: 0.4 }}
              className="mt-auto"
            >
              <p className="text-white/80 text-lg leading-relaxed mb-6 max-w-md">
                {feature.description}
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs">
                <span>Explore Nature</span>
                <Compass className="w-4 h-4 animate-spin-slow" />
              </div>
            </motion.div>
          </div>

          {/* Shine Effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine" />
        </div>
      </Link>
    </motion.div>
  )
}
