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
        const res = await fetch("http://localhost:5000/api/features")
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

        <div className="bento-grid">
          {features.map((feature, index) => (
            <Link key={index} href={feature.link || "/planner"} className={feature.className}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 bg-white/5 backdrop-blur-md border border-foreground/5 shadow-sm h-full"
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-6 w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                    {(() => {
                      const Icon = IconMap[feature.iconName] || Leaf
                      return <Icon className="w-7 h-7 text-emerald-500" />
                    })()}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:translate-x-1 transition-transform duration-500">{feature.title}</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
