"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard, Map, Compass, Shield, Globe, Bird, Users,
    LogOut, Menu, Bell, Star, Heart, TrendingUp, Clock, Leaf,
    ChevronRight, MapPin, Calendar, Plane, Zap, Award, Target,
    BookOpen, User, Settings, Plus, ArrowRight, Activity,
    CheckCircle, AlertTriangle, Info, X
} from "lucide-react"

const BACKEND = "https://tourify-backend-99ef.onrender.com"

const sidebarLinks = [
    { href: "/customer-dashboard", icon: LayoutDashboard, label: "Overview", active: true },
    { href: "/planner", icon: Compass, label: "AI Planner" },
    { href: "/destinations", icon: Map, label: "Explore Trails" },
    { href: "/nature-guard", icon: Shield, label: "Nature Guard" },
    { href: "/global-sanctuary", icon: Globe, label: "Sanctuary" },
    { href: "/tribal-sync", icon: Users, label: "Tribe" },
    { href: "/wildlife-insight", icon: Bird, label: "Wildlife" },
    { href: "/dashboard", icon: BookOpen, label: "Travel Log" },
    { href: "/profile", icon: User, label: "Profile" },
]

const upcomingTrips = [
    { name: "Bali, Indonesia", date: "Apr 12 - Apr 22, 2025", status: "confirmed", img: "🌴", days: 41 },
    { name: "Patagonia, Chile", date: "Jul 3 - Jul 15, 2025", status: "planning", img: "🏔️", days: 123 },
]

const savedDestinations = [
    { name: "Maldives", category: "Beach", rating: 4.9, price: 2400, img: "🏝️" },
    { name: "Kyoto", category: "Culture", rating: 4.7, price: 1200, img: "⛩️" },
    { name: "Serengeti", category: "Adventure", rating: 4.8, price: 3100, img: "🦁" },
]

const achievements = [
    { icon: "🌍", label: "World Traveler", desc: "5+ countries visited", unlocked: true },
    { icon: "🌱", label: "Eco Warrior", desc: "10 eco trips planned", unlocked: true },
    { icon: "⭐", label: "Top Reviewer", desc: "Leave 10 reviews", unlocked: false },
    { icon: "🦅", label: "Wildlife Scout", desc: "Visit 3 sanctuaries", unlocked: false },
]

export default function CustomerDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [notifications, setNotifications] = useState<any[]>([])
    const [showNotif, setShowNotif] = useState(false)
    const [activeTab, setActiveTab] = useState<"trips" | "saved">("trips")

    useEffect(() => {
        const userData = localStorage.getItem("user")
        if (userData) {
            setUser(JSON.parse(userData))
        } else {
            router.push("/login")
        }
    }, [router])

    useEffect(() => {
        fetch(`${BACKEND}/api/notifications`)
            .then(r => r.json())
            .then(d => Array.isArray(d) ? setNotifications(d) : setNotifications([]))
            .catch(() => setNotifications([]))
    }, [])

    if (!user) return (
        <div className="min-h-screen bg-[hsl(145,25%,6%)] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    const firstName = user.name?.split(" ")[0] || "Explorer"

    return (
        <div className="min-h-screen bg-[hsl(145,25%,6%)] flex text-[hsl(120,15%,92%)]">
            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed left-0 top-0 h-full w-64 z-40 border-r border-white/5 flex flex-col"
                        style={{ background: "linear-gradient(180deg, hsl(145,28%,8%) 0%, hsl(145,25%,6%) 100%)" }}
                    >
                        {/* Logo */}
                        <div className="p-6 border-b border-white/5">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Leaf className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-white">Tourify<span className="text-emerald-400">.ai</span></div>
                                    <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Explorer Hub</div>
                                </div>
                            </Link>
                        </div>

                        {/* User Card */}
                        <div className="px-4 py-3">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-600/5 border border-emerald-500/15">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                        {user.name?.charAt(0) || "E"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-white truncate">{user.name}</div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                            <span className="text-[10px] text-yellow-400 font-bold">Gold Explorer</span>
                                        </div>
                                    </div>
                                </div>
                                {/* XP Bar */}
                                <div className="mt-3">
                                    <div className="flex justify-between text-[10px] text-white/40 mb-1">
                                        <span>XP Progress</span><span>720 / 1000</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "72%" }} transition={{ delay: 0.5, duration: 1 }}
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
                            {sidebarLinks.map((link) => (
                                <Link key={link.href} href={link.href}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${link.active
                                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                        : "text-white/50 hover:text-white hover:bg-white/5"}`}
                                >
                                    <link.icon className="w-4 h-4 shrink-0" />
                                    {link.label}
                                    {link.active && <ChevronRight className="w-3 h-3 ml-auto" />}
                                </Link>
                            ))}
                        </nav>

                        {/* Bottom */}
                        <div className="p-4 border-t border-white/5 space-y-2">
                            <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">
                                <Settings className="w-4 h-4" /> Settings
                            </Link>
                            <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/5 transition-all">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </Link>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 border-b border-white/5 backdrop-blur-xl bg-[hsl(145,25%,6%)]/80">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <span className="text-sm font-semibold text-white">Good morning, {firstName} 👋</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <div className="relative">
                            <button onClick={() => setShowNotif(!showNotif)}
                                className="relative p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-all">
                                <Bell className="w-4 h-4" />
                                {notifications.filter(n => !n.isRead).length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                )}
                            </button>
                            <AnimatePresence>
                                {showNotif && (
                                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                                        style={{ background: "hsl(145,28%,8%)" }}
                                    >
                                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                                            <h3 className="text-sm font-bold text-white">Notifications</h3>
                                            <button onClick={() => setShowNotif(false)} className="text-white/30 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                                            {notifications.length > 0 ? notifications.slice(0, 5).map(n => (
                                                <div key={n._id} className="flex items-start gap-3 p-4 hover:bg-white/3 transition-colors">
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${n.type === "alert" ? "bg-amber-500/10" : n.type === "success" ? "bg-emerald-500/10" : "bg-blue-500/10"}`}>
                                                        {n.type === "alert" ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> : n.type === "success" ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Info className="w-3.5 h-3.5 text-blue-400" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-white">{n.title}</p>
                                                        <p className="text-[11px] text-white/40 mt-0.5 line-clamp-2">{n.message}</p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="p-8 text-center text-xs text-white/30">No new notifications</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <Link href="/planner">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
                                <Plus className="w-4 h-4" /> Plan Trip
                            </button>
                        </Link>
                    </div>
                </header>

                <main className="p-6 space-y-6">
                    {/* Hero Welcome Banner */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-2xl overflow-hidden p-6 sm:p-8"
                        style={{ background: "linear-gradient(135deg, hsl(145,40%,12%) 0%, hsl(180,35%,12%) 100%)" }}
                    >
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: "radial-gradient(circle at 70% 50%, hsl(142,65%,55%), transparent 60%)" }} />
                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {firstName}! 🌿</h1>
                                <p className="text-sm text-white/50 max-w-md">You've explored <span className="text-emerald-400 font-bold">12 destinations</span> this year. Your carbon footprint is <span className="text-emerald-400 font-bold">42% lower</span> than average.</p>
                            </div>
                            <Link href="/planner">
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-all shrink-0 shadow-lg shadow-emerald-500/25">
                                    <Zap className="w-4 h-4" /> AI Plan Trip <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Countries Visited", value: "8", icon: Globe, color: "emerald", sub: "+2 this year" },
                            { label: "Trips Planned", value: "12", icon: Map, color: "blue", sub: "2 upcoming" },
                            { label: "Eco Score", value: "94%", icon: Leaf, color: "teal", sub: "Top 5%" },
                            { label: "Days Traveled", value: "47", icon: Calendar, color: "purple", sub: "Since 2024" },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                                className="rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-all cursor-pointer"
                                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}
                            >
                                <div className={`w-9 h-9 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-3`}>
                                    <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                                </div>
                                <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
                                <div className="text-xs text-white/40">{stat.label}</div>
                                <div className="text-[10px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />{stat.sub}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Trips & Saved */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Trips Panel */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="xl:col-span-2 rounded-2xl border border-white/5 overflow-hidden"
                            style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}
                        >
                            <div className="flex items-center justify-between p-5 border-b border-white/5">
                                <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                                    {(["trips", "saved"] as const).map(tab => (
                                        <button key={tab} onClick={() => setActiveTab(tab)}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${activeTab === tab ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30" : "text-white/40 hover:text-white"}`}>
                                            {tab === "trips" ? "My Trips" : "Saved"}
                                        </button>
                                    ))}
                                </div>
                                <Link href="/planner">
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all">
                                        <Plus className="w-3 h-3" /> New
                                    </button>
                                </Link>
                            </div>

                            <div className="p-5 space-y-3">
                                {activeTab === "trips" ? upcomingTrips.map((trip, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                                        className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/3 transition-all cursor-pointer">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/10 flex items-center justify-center text-2xl border border-white/5">
                                            {trip.img}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-white">{trip.name}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="w-3 h-3 text-white/30" />
                                                <span className="text-xs text-white/40">{trip.date}</span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${trip.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                                                {trip.status}
                                            </span>
                                            <div className="text-[10px] text-white/30 mt-1.5 flex items-center gap-1 justify-end">
                                                <Clock className="w-3 h-3" /> {trip.days} days away
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : savedDestinations.map((dest, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                                        className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-emerald-500/20 hover:bg-emerald-500/3 transition-all cursor-pointer">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/10 flex items-center justify-center text-2xl border border-white/5">
                                            {dest.img}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-white">{dest.name}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <MapPin className="w-3 h-3 text-white/30" />
                                                <span className="text-xs text-white/40">{dest.category}</span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="flex items-center gap-1 justify-end text-yellow-400">
                                                <Star className="w-3 h-3 fill-yellow-400" />
                                                <span className="text-xs font-bold text-white">{dest.rating}</span>
                                            </div>
                                            <div className="text-sm font-bold text-emerald-400 mt-1">${dest.price}</div>
                                        </div>
                                        <button className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                            <Heart className="w-4 h-4 fill-current" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="px-5 pb-5">
                                <Link href={activeTab === "trips" ? "/planner" : "/destinations"}>
                                    <button className="w-full py-3 rounded-xl border border-white/5 text-sm text-white/40 hover:text-white hover:border-emerald-500/20 transition-all flex items-center justify-center gap-2">
                                        View All <ChevronRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Achievements + Quick Links */}
                        <div className="space-y-4">
                            {/* Achievements */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="rounded-2xl border border-white/5 p-5"
                                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-white text-sm flex items-center gap-2">
                                        <Award className="w-4 h-4 text-yellow-400" /> Achievements
                                    </h2>
                                    <span className="text-[10px] bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full font-bold border border-yellow-400/20">2/4</span>
                                </div>
                                <div className="space-y-3">
                                    {achievements.map((a, i) => (
                                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${a.unlocked ? "border-yellow-400/20 bg-yellow-400/5" : "border-white/5 opacity-40"}`}>
                                            <span className="text-xl">{a.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-xs font-bold ${a.unlocked ? "text-yellow-400" : "text-white/40"}`}>{a.label}</div>
                                                <div className="text-[10px] text-white/30">{a.desc}</div>
                                            </div>
                                            {a.unlocked && <CheckCircle className="w-4 h-4 text-yellow-400 shrink-0" />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Quick Access */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="rounded-2xl border border-white/5 p-5"
                                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}
                            >
                                <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-emerald-400" /> Quick Access
                                </h2>
                                <div className="space-y-2">
                                    {[
                                        { href: "/planner", icon: Compass, label: "Plan with AI", color: "emerald", desc: "Personalized itinerary" },
                                        { href: "/destinations", icon: Plane, label: "Explore Destinations", color: "blue", desc: "240+ locations" },
                                        { href: "/wildlife-insight", icon: Bird, label: "Wildlife Insights", color: "teal", desc: "Real-time data" },
                                        { href: "/tribal-sync", icon: Users, label: "Join Tribe", color: "purple", desc: "Community feed" },
                                    ].map((item, i) => (
                                        <Link key={i} href={item.href}
                                            className={`flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-${item.color}-500/30 hover:bg-${item.color}-500/5 transition-all group`}>
                                            <div className={`w-8 h-8 rounded-lg bg-${item.color}-500/10 flex items-center justify-center shrink-0`}>
                                                <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors">{item.label}</div>
                                                <div className="text-[10px] text-white/30">{item.desc}</div>
                                            </div>
                                            <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Eco Impact Footer Card */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="rounded-2xl border border-emerald-500/15 p-6 relative overflow-hidden"
                        style={{ background: "linear-gradient(135deg, hsl(145,40%,10%) 0%, hsl(165,35%,9%) 100%)" }}
                    >
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: "radial-gradient(ellipse at 10% 50%, hsl(142,65%,55%), transparent 60%)" }} />
                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white">Your Eco Impact This Year</h3>
                                    <p className="text-xs text-white/40 mt-0.5">Keep choosing sustainable routes to unlock rewards</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                {[
                                    { label: "CO₂ Saved", value: "1.2T" },
                                    { label: "Eco Trips", value: "8" },
                                    { label: "Trees Planted", value: "24" },
                                ].map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-lg font-bold text-emerald-400">{stat.value}</div>
                                        <div className="text-[10px] text-white/40">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
