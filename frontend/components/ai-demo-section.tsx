"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Compass, Leaf, User, ArrowRight, Send, Sparkles, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

const demoMessages = [
  {
    role: "user",
    content: "I want to plan a sustainable 5-day retreat in the Swiss Alps"
  },
  {
    role: "ai",
    content:
      "A serene choice! For a 5-day alpine escape, I've curated a low-impact path:\n\n🏔️ Lauterbrunnen (2 days) - Valley of 72 Waterfalls\n🌲 Murren (2 days) - Car-free Alpine Village\n🛶 Lake Brienz (1 day) - Crystalline Waters\n\nNature Insights:\n• Stay: Eco-certified mountain lodges\n• Mobility: Electric rail & hiking trails\n• Experience: Glacial lake bathing & wildflower trail walking",
  },
  {
    role: "user",
    content: "Yes, and include some quiet meditation spots"
  },
  {
    role: "ai",
    content:
      "Perfect. I've added three 'Silence Sanctuaries' to your route:\n\n✨ The Hidden Grotto near Staubbach\n✨ Morning mist ridge in Murren\n✨ Alpine herb garden at Allmendhubel\n\nYour sanctuary map is ready...",
  },
]

export function AIDemoSection() {
  const [messages, setMessages] = useState<any[]>([])
  const [visibleCount, setVisibleCount] = useState<number>(0)
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState("")

  // Initial Auto-Play Sequence
  useEffect(() => {
    if (visibleCount < demoMessages.length) {
      setIsTyping(true)
      const timer = setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, demoMessages[visibleCount]])
        setVisibleCount(prev => prev + 1)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [visibleCount])

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return

    const userMsg = { role: "user", content: inputValue }
    setMessages(prev => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)

    // AI Response Logic (Backend Fetch)
    fetch("http://localhost:5000/api/spirit/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: inputValue })
    })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev, data]);
        setIsTyping(false);
      })
      .catch(err => {
        console.error("Spirit API Error:", err);
        setMessages(prev => [...prev, { role: "ai", content: "I'm having trouble connecting to the global ley lines. Please try again later." }]);
        setIsTyping(false);
      });
  }

  const resetDemo = () => {
    setMessages([])
    setVisibleCount(0)
    setIsTyping(false)
  }

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left Content: The Pitch */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Intelligence × Nature</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-[1.1]">
              Intuitive Planning <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Powered by Spirit</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Our AI doesn't just calculate routes; it finds sanctuaries. Speak your desire, and
              watch as the perfect low-impact path unfolds before you.
            </p>

            <div className="flex flex-wrap gap-5 pt-4">
              <Link href="/planner">
                <Button className="h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl shadow-emerald-500/20 hover:scale-105 transition-all text-lg font-bold">
                  Start Planning
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="h-16 px-10 rounded-2xl border-white/10 hover:bg-white/5 bg-transparent font-bold text-lg"
                onClick={resetDemo}
              >
                Replay Demo
              </Button>
            </div>
          </motion.div>

          {/* Right Content: The Interactive Spirit Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Soft Glow */}
            <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl opacity-50 rounded-[4rem]" />

            <div className="glass-panel rounded-[3rem] p-8 lg:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-neutral-950/80 backdrop-blur-3xl overflow-hidden group">

              {/* Spirit Header */}
              <div className="flex items-center justify-between pb-8 mb-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Compass className="w-8 h-8 text-white animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-xl tracking-tight">Tourify Spirit</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest">Harmony Found</span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Leaf className="w-4 h-4 text-emerald-500 opacity-60" />
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="space-y-8 h-[400px] overflow-y-auto pr-4 custom-scrollbar scroll-smooth flex flex-col">
                <AnimatePresence initial={false} mode="popLayout">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={`${index}-${msg.role}`}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "items-start"}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === "user"
                          ? "bg-emerald-500 border border-emerald-400/50"
                          : "bg-white/5 border border-white/10"
                          }`}
                      >
                        {msg.role === "user" ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Leaf className="w-3 h-3 text-emerald-500" />
                          </div>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`rounded-[1.8rem] p-6 max-w-[85%] ${msg.role === "user"
                          ? "bg-emerald-600 text-white shadow-xl shadow-emerald-900/10 rounded-tr-none"
                          : "bg-white/[0.03] border border-white/10 text-foreground/90 rounded-tl-none backdrop-blur-sm"
                          }`}
                      >
                        <p className="text-sm md:text-base whitespace-pre-line leading-relaxed font-medium">
                          {msg.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-emerald-500/50" />
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-[1.8rem] rounded-tl-none p-5 px-6">
                      <div className="flex gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                        <span
                          className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <span
                          className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input Dock */}
              <div className="mt-10 pt-8 border-t border-white/5">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="relative flex items-center"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Where does your spirit want to go?"
                    className="w-full h-16 pl-8 pr-16 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm italic focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
                  <div className="absolute right-2">
                    <Button
                      type="submit"
                      disabled={isTyping || !inputValue.trim()}
                      className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5 ml-0.5" />
                    </Button>
                  </div>
                </form>
              </div>

            </div>

            {/* Floating Decorative Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -right-10 bg-emerald-500/20 px-4 py-2 rounded-2xl border border-emerald-500/30 backdrop-blur-md hidden xl:block"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Sustainable Route Verified</span>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}
