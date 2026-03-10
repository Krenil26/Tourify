"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Calendar, Users, Briefcase, MapPin, CheckCircle, Clock, XCircle, ChevronRight, Activity } from "lucide-react"
import Link from "next/link"

const BACKEND = "https://tourify-4cuu.onrender.com"

export default function MyBookingsPage() {
    const router = useRouter()
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user")
        const storedToken = sessionStorage.getItem("token")

        if (!storedUser || !storedToken) {
            router.push("/login")
            return
        }
        setUser(JSON.parse(storedUser))

        fetch(`${BACKEND}/api/bookings/my`, {
            headers: { "Authorization": `Bearer ${storedToken}` }
        })
            .then(res => res.json())
            .then(data => {
                setBookings(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch(err => {
                console.error("Fetch error:", err)
                setLoading(false)
            })
    }, [router])

    if (loading || !user) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-background">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background text-foreground overflow-hidden">
            <Navbar />

            <div className="pt-24 pb-16 max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-emerald-500" />
                            My Bookings
                        </h1>
                        <p className="text-muted-foreground italic">Track and manage your planned eco-trails.</p>
                    </div>

                    <div className="grid gap-6">
                        {bookings.length === 0 ? (
                            <div className="glass-card rounded-[2rem] p-12 text-center border-white/5 space-y-4">
                                <Activity className="w-12 h-12 text-emerald-500/50 mx-auto" />
                                <h3 className="text-xl font-bold">No bookings yet</h3>
                                <p className="text-muted-foreground">Start planning your next adventure with our AI Planner.</p>
                                <Link href="/planner">
                                    <button className="mt-4 px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold inline-flex items-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
                                        Plan a Trip <ChevronRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            bookings.map((booking, i) => (
                                <motion.div
                                    key={booking.id || i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 hover:border-emerald-500/20 transition-all flex flex-col md:flex-row gap-6 relative"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/20">
                                        <MapPin className="w-8 h-8 text-emerald-500" />
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-bold">{booking.destination}</h3>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${booking.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        booking.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                    {booking.status || 'Pending'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground font-mono">ID: {booking.id}</p>
                                            <p className="text-[11px] mt-2 text-white/50 italic">
                                                {booking.status === 'approved' ? '✓ Your request has been accepted by our team.' :
                                                    booking.status === 'rejected' ? '✕ This request could not be approved.' :
                                                        '⋯ Pending verification by our expert curators.'}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-emerald-500/70" />
                                                <span>{booking.startDate || "TBD"} - {booking.endDate || "TBD"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="w-4 h-4 text-emerald-500/70" />
                                                <span>{booking.travelers} Travelers</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-semibold">
                                                <span className="text-emerald-400">₹{booking.totalCost?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex items-center">
                                        <Link href={`/booking?id=${booking.id}`}>
                                            <button className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 text-white text-sm font-semibold transition-all border border-white/10 hover:border-emerald-500/30 flex items-center justify-center gap-2">
                                                View Details <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    )
}
