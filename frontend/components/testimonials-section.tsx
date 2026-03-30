"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Star, Quote, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

type Feedback = {
  id: string
  name?: string
  rating?: number
  content?: string
  createdAt?: string
}

const FEEDBACK_API = "https://tourify-4cuu.onrender.com/api/feedback"

const gradients = ["from-emerald-500 to-teal-400", "from-amber-400 to-orange-500", "from-teal-400 to-emerald-600"]

function initials(name?: string) {
  const parts = (name || "Customer").trim().split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0] || "C"
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : ""
  return (first + second).toUpperCase()
}

export function TestimonialsSection() {
  const { toast } = useToast()
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState<number>(5)
  const [content, setContent] = useState("")

  const isLoggedIn = useMemo(() => {
    if (typeof window === "undefined") return false
    return Boolean(sessionStorage.getItem("token") && sessionStorage.getItem("user"))
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(FEEDBACK_API, { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load feedback")
        const data = await res.json()
        setFeedback(Array.isArray(data) ? data : [])
      } catch {
        setFeedback([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const submitFeedback = async () => {
    const trimmed = content.trim()
    if (!trimmed) {
      toast({ variant: "destructive", title: "Please write feedback", description: "Add a short message before submitting." })
      return
    }

    const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null
    if (!token) {
      toast({ variant: "destructive", title: "Please login", description: "You must be logged in to add feedback." })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(FEEDBACK_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: trimmed, rating }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit feedback")
      }

      setFeedback((prev) => [data as Feedback, ...prev])
      setContent("")
      setRating(5)
      toast({ title: "Thanks for your feedback!", description: "Your message has been posted." })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Could not post feedback", description: e?.message || "Please try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-24 relative bg-gradient-to-b from-background via-emerald-500/5 to-background overflow-hidden">

      {/* Background Ornament */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="nature-leaf w-96 h-96 absolute -top-20 -left-20 rotate-45 text-emerald-500" />
        <div className="nature-leaf w-96 h-96 absolute -bottom-20 -right-20 -rotate-12 text-teal-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-600">Traveler Log</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Voice of the <span className="text-nature-gradient">Earth Explorers</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Join a community dedicated to mindful exploration and deep connection with our planet.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-14 glass-panel rounded-[2rem] p-6 sm:p-8 border-emerald-500/5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">Add your feedback</h3>
            {!isLoggedIn && (
              <Link href="/login" className="text-sm font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">
                Login
              </Link>
            )}
          </div>

          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setRating(v)}
                className="p-1"
                aria-label={`Rate ${v} stars`}
              >
                <Star
                  className={
                    v <= rating
                      ? "w-5 h-5 text-emerald-500 fill-emerald-500"
                      : "w-5 h-5 text-foreground/30"
                  }
                />
              </button>
            ))}
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience..."
            className="bg-transparent"
            disabled={!isLoggedIn || submitting}
          />

          <div className="mt-4 flex justify-end">
            <Button onClick={submitFeedback} disabled={!isLoggedIn || submitting}>
              {submitting ? "Posting..." : "Post feedback"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <div className="md:col-span-3 text-center text-sm text-muted-foreground">Loading feedback...</div>
          ) : feedback.length === 0 ? (
            <div className="md:col-span-3 text-center text-sm text-muted-foreground">No feedback yet. Be the first to post one.</div>
          ) : (
            feedback.slice(0, 6).map((item, index) => {
              const itemRating = Math.min(Math.max(Number(item.rating) || 5, 1), 5)
              const gradient = gradients[index % gradients.length]
              const displayName = (item.name || "Customer").toString()

              return (
            <div
              key={item.id || index}
              className="glass-panel rounded-[2.5rem] p-8 relative shadow-xl card-hover group transition-all duration-500 hover:-translate-y-2 border-emerald-500/5"
            >
              <div
                className={`absolute top-8 right-8 w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} opacity-10 flex items-center justify-center group-hover:opacity-20 transition-opacity`}
              >
                <Quote className="w-6 h-6 text-foreground" />
              </div>

              <div className="flex items-center gap-1 mb-6">
                {[...Array(itemRating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                ))}
              </div>

              <p className="text-foreground/80 mb-8 leading-relaxed font-medium italic">"{item.content || ""}"</p>

              <div className="flex items-center gap-4">
                <div className={`p-0.5 rounded-full bg-gradient-to-br ${gradient}`}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center border-4 border-background bg-background/60 text-foreground font-bold">
                    {initials(displayName)}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-foreground text-lg">{displayName}</div>
                  <div
                    className={`text-sm bg-gradient-to-r ${gradient} bg-clip-text text-transparent font-bold uppercase tracking-wider`}
                  >
                    Customer
                  </div>
                </div>
              </div>
            </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
