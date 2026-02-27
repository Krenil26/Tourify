"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Compass, Leaf } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Organic Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-12 md:p-16 rounded-[3rem] border border-emerald-500/10 shadow-2xl relative overflow-hidden group"
          >
            {/* Soft Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px]" />

            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <Compass className="w-10 h-10 text-emerald-600 animate-spin-slow" />
              </div>

              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Quiet Your Mind. <br />
                <span className="text-nature-gradient">Begin Your Journey.</span>
              </h2>

              <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                Join thousands of mindful explorers who have discovered their true path in the wild.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                <Link href="/destinations">
                  <Button size="lg" className="h-16 px-10 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:scale-105">
                    Start Exploring <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-16 px-10 rounded-full border-foreground/10 hover:bg-foreground/5 text-foreground text-lg backdrop-blur-md transition-all hover:scale-105">
                  Meet the Community
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-6 text-foreground/40 text-sm">
                <Leaf className="w-4 h-4" />
                <span>Eco-Friendly • Mindful • Community Driven</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
