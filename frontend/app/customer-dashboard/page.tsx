"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard, Map, Compass, Shield, Globe, Bird, Users,
    LogOut, Menu, Bell, Star, Heart, Leaf, ChevronRight, MapPin,
    Calendar, Plane, Zap, User, Settings, Plus, ArrowRight, Activity,
    CheckCircle, AlertTriangle, Info, X, BookOpen, RefreshCw
} from "lucide-react"

const BACKEND = "https://tourify-4cuu.onrender.com"

const sidebarLinks = [
    { href: "/customer-dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/planner", icon: Compass, label: "AI Planner" },
    { href: "/destinations", icon: Map, label: "Explore Trails" },
    { href: "/nature-guard", icon: Shield, label: "Nature Guard" },
    { href: "/global-sanctuary", icon: Globe, label: "Sanctuary" },
    { href: "/tribal-sync", icon: Users, label: "Tribe" },
    { href: "/wildlife-insight", icon: Bird, label: "Wildlife" },
    { href: "/dashboard", icon: BookOpen, label: "Travel Log" },
    { href: "/profile", icon: User, label: "Profile" },
]

export default function CustomerDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [token, setToken] = useState<string>("")
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [showNotif, setShowNotif] = useState(false)

    // Real data from backend
    const [profile, setProfile] = useState<any>(null)
    const [destinations, setDestinations] = useState<any[]>([])
    const [notifications, setNotifications] = useState<any[]>([])
    const [tribeCount, setTribeCount] = useState<number>(0)

    // Loading states
    const [loadingProfile, setLoadingProfile] = useState(true)
    const [loadingDestinations, setLoadingDestinations] = useState(true)

    // Auth guard
    useEffect(() => {
        const userData = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")
        if (userData && storedToken) {
            setUser(JSON.parse(userData))
            setToken(storedToken)
        } else {
            router.push("/login")
        }
    }, [router])

    // Fetch authenticated profile
    useEffect(() => {
        if (!token) return
        setLoadingProfile(true)
        fetch(`${BACKEND}/api/customer/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => { setProfile(d); setLoadingProfile(false) })
            .catch(() => setLoadingProfile(false))
    }, [token])

    // Fetch destinations from DB
    useEffect(() => {
        setLoadingDestinations(true)
        fetch(`${BACKEND}/api/world/destinations`)
            .then(r => r.json())
            .then(d => { setDestinations(Array.isArray(d) ? d : []); setLoadingDestinations(false) })
            .catch(() => setLoadingDestinations(false))
    }, [])

    // Fetch notifications
    useEffect(() => {
        fetch(`${BACKEND}/api/notifications`)
            .then(r => r.json())
            .then(d => setNotifications(Array.isArray(d) ? d : []))
            .catch(() => setNotifications([]))
    }, [])

    // Fetch tribe posts count
    useEffect(() => {
        fetch(`${BACKEND}/api/tribe`)
            .then(r => r.json())
            .then(d => setTribeCount(Array.isArray(d) ? d.length : 0))
            .catch(() => setTribeCount(0))
    }, [])

    const unreadCount = notifications.filter(n => !n.isRead).length
    const displayUser = profile || user
    const firstName = displayUser?.name?.split(" ")[0] || "Explorer"

    // Top rated destinations from DB
    const topDestinations = [...destinations].sort((a, b) => b.rating - a.rating).slice(0, 4)
    // Beach destinations
    const beachDests = destinations.filter(d => d.category?.toLowerCase() === "beach").slice(0, 3)

    if (!user) return (
        <div className="min-h-screen bg-[hsl(145,25%,6%)] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

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

                        {/* User card — real profile data */}
                        <div className="px-4 py-3">
                            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-600/5 border border-emerald-500/15">
                                {loadingProfile ? (
                                    <div className="flex items-center gap-3 animate-pulse">
                                        <div className="w-10 h-10 rounded-full bg-white/10" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-3 bg-white/10 rounded w-24" />
                                            <div className="h-2 bg-white/10 rounded w-16" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                            {displayUser?.name?.charAt(0)?.toUpperCase() || "E"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-white truncate">{displayUser?.name}</div>
                                            <div className="text-[10px] text-white/40 truncate">{displayUser?.email}</div>
                                            {displayUser?.location && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-2.5 h-2.5 text-emerald-500" />
                                                    <span className="text-[10px] text-emerald-400">{displayUser.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Nav */}
                        <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
                            {sidebarLinks.map((link) => (
                                <Link key={link.href} href={link.href}
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-white/50 hover:text-white hover:bg-white/5">
                                    <link.icon className="w-4 h-4 shrink-0" />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-white/5 space-y-1">
                            <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all">
                                <Settings className="w-4 h-4" /> Settings
                            </Link>
                            <button onClick={() => { localStorage.clear(); router.push("/login") }}
                                className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 hover:bg-red-500/5 transition-all">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
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
                        <span className="text-sm font-semibold text-white hidden sm:block">
                            Welcome, {firstName} 👋
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Real notifications bell */}
                        <div className="relative">
                            <button onClick={() => setShowNotif(!showNotif)}
                                className="relative p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-all">
                                <Bell className="w-4 h-4" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                )}
                            </button>
                            <AnimatePresence>
                                {showNotif && (
                                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                                        style={{ background: "hsl(145,28%,8%)" }}>
                                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                                            <h3 className="text-sm font-bold text-white">
                                                Notifications {unreadCount > 0 && <span className="text-[10px] ml-1 bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full">{unreadCount} new</span>}
                                            </h3>
                                            <button onClick={() => setShowNotif(false)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
                                        </div>
                                        <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                                            {notifications.length > 0 ? notifications.slice(0, 6).map(n => (
                                                <div key={n._id} className="flex items-start gap-3 p-4 hover:bg-white/3 transition-colors">
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${n.type === "alert" ? "bg-amber-500/10" : n.type === "success" ? "bg-emerald-500/10" : "bg-blue-500/10"}`}>
                                                        {n.type === "alert" ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> :
                                                            n.type === "success" ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> :
                                                                <Info className="w-3.5 h-3.5 text-blue-400" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-white">{n.title}</p>
                                                        <p className="text-[11px] text-white/40 mt-0.5 line-clamp-2">{n.message}</p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="p-8 text-center text-xs text-white/30">No notifications</div>
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
                    {/* Welcome Banner using real profile */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        className="relative rounded-2xl overflow-hidden p-6 sm:p-8"
                        style={{ background: "linear-gradient(135deg, hsl(145,40%,12%) 0%, hsl(180,35%,12%) 100%)" }}
                    >
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: "radial-gradient(circle at 70% 50%, hsl(142,65%,55%), transparent 60%)" }} />
                        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">
                                    {loadingProfile ? "Loading..." : `Welcome back, ${firstName}! 🌿`}
                                </h1>
                                <p className="text-sm text-white/50 max-w-md">
                                    {destinations.length > 0
                                        ? <>There are <span className="text-emerald-400 font-bold">{destinations.length} destinations</span> to explore and <span className="text-emerald-400 font-bold">{tribeCount} tribe posts</span> from the community.</>
                                        : "Start planning your next eco-friendly adventure with AI."}
                                </p>
                                {displayUser?.email && (
                                    <p className="text-xs text-white/30 mt-2">{displayUser.email}</p>
                                )}
                            </div>
                            <Link href="/planner">
                                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition-all shrink-0 shadow-lg shadow-emerald-500/25">
                                    <Zap className="w-4 h-4" /> AI Plan Trip <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats — real data counts */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Destinations", value: loadingDestinations ? "..." : destinations.length, icon: Globe, color: "emerald", sub: "Available worldwide" },
                            { label: "Tribe Posts", value: tribeCount || "...", icon: Users, color: "blue", sub: "Community stories" },
                            { label: "Alerts", value: notifications.filter(n => n.type === "alert").length, icon: AlertTriangle, color: "amber", sub: "Active nature alerts" },
                            { label: "Notifications", value: notifications.length, icon: Bell, color: "teal", sub: `${unreadCount} unread` },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                                className="rounded-2xl p-5 border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer"
                                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}>
                                <div className={`w-9 h-9 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-3`}>
                                    <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                                </div>
                                <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
                                <div className="text-xs text-white/40">{stat.label}</div>
                                <div className="text-[10px] text-white/25 mt-1">{stat.sub}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Top Destinations from DB */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="rounded-2xl border border-white/5 overflow-hidden"
                        style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}>
                        <div className="flex items-center justify-between p-5 border-b border-white/5">
                            <h2 className="font-bold text-white text-sm flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-400" /> Top Rated Destinations
                                <span className="text-[10px] text-white/30 font-normal">from database</span>
                            </h2>
                            <Link href="/destinations">
                                <button className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                                    View All <ChevronRight className="w-3 h-3" />
                                </button>
                            </Link>
                        </div>

                        {loadingDestinations ? (
                            <div className="p-8 flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs text-white/30">Fetching destinations from database...</p>
                            </div>
                        ) : topDestinations.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-white/30">No destinations in the database yet.</p>
                                <p className="text-xs text-white/20 mt-1">Run the seed script to populate destinations.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {topDestinations.map((dest, i) => (
                                    <motion.div key={dest._id}
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                                        className="group flex items-center gap-4 p-4 hover:bg-white/3 transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/10 border border-white/5 overflow-hidden shrink-0">
                                            {dest.image ? (
                                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">🌍</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-white">{dest.name}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <MapPin className="w-3 h-3 text-white/30" />
                                                <span className="text-xs text-white/40">{dest.country}</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{dest.category}</span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="flex items-center gap-1 justify-end">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-bold text-white">{dest.rating}</span>
                                                <span className="text-xs text-white/30">({dest.reviews})</span>
                                            </div>
                                            <div className="text-sm font-bold text-emerald-400 mt-1">${dest.price}<span className="text-[10px] text-white/30">/person</span></div>
                                        </div>
                                        <Link href={`/planner?destination=${encodeURIComponent(dest.name)}`}>
                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20">
                                                Plan <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Profile Info & Quick Links */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Real Profile Details */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="rounded-2xl border border-white/5 p-5"
                            style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-bold text-white text-sm flex items-center gap-2">
                                    <User className="w-4 h-4 text-emerald-400" /> My Profile
                                </h2>
                                <Link href="/profile">
                                    <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors flex items-center gap-1">
                                        Edit <ChevronRight className="w-3 h-3" />
                                    </button>
                                </Link>
                            </div>
                            {loadingProfile ? (
                                <div className="space-y-3 animate-pulse">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex justify-between">
                                            <div className="h-3 bg-white/5 rounded w-20" />
                                            <div className="h-3 bg-white/5 rounded w-32" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {[
                                        { label: "Full Name", value: displayUser?.name },
                                        { label: "Email", value: displayUser?.email },
                                        { label: "Phone", value: displayUser?.phone || "Not set" },
                                        { label: "Location", value: displayUser?.location || "Not set" },
                                        { label: "Account Type", value: displayUser?.role === "admin" ? "Administrator" : "Explorer" },
                                        { label: "Member Since", value: displayUser?.createdAt ? new Date(displayUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—" },
                                    ].map((field, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                                            <span className="text-xs text-white/30">{field.label}</span>
                                            <span className="text-xs font-medium text-white/80 text-right max-w-[60%] truncate">{field.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Live Notifications */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="rounded-2xl border border-white/5 p-5"
                            style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-bold text-white text-sm flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-emerald-400" /> Latest Alerts
                                    {unreadCount > 0 && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">{unreadCount} new</span>}
                                </h2>
                            </div>
                            {notifications.length === 0 ? (
                                <div className="text-center py-6">
                                    <Bell className="w-8 h-8 text-white/10 mx-auto mb-2" />
                                    <p className="text-xs text-white/30">No notifications found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {notifications.slice(0, 5).map((n, i) => (
                                        <motion.div key={n._id}
                                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}
                                            className="flex items-start gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${n.type === "alert" ? "bg-amber-500/10" : n.type === "success" ? "bg-emerald-500/10" : "bg-blue-500/10"}`}>
                                                {n.type === "alert" ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> :
                                                    n.type === "success" ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> :
                                                        <Info className="w-3.5 h-3.5 text-blue-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-white/80 leading-tight">{n.title}</p>
                                                <p className="text-[11px] text-white/40 mt-0.5 line-clamp-2">{n.message}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Explore Quick Actions */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="relative rounded-2xl border border-emerald-500/15 p-6 overflow-hidden"
                        style={{ background: "linear-gradient(135deg, hsl(145,40%,10%) 0%, hsl(165,35%,9%) 100%)" }}
                    >
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: "radial-gradient(ellipse at 10% 50%, hsl(142,65%,55%), transparent 60%)" }} />
                        <div className="relative">
                            <h2 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-400" /> Explore the Platform
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { href: "/planner", icon: Compass, label: "AI Planner", desc: "Build itinerary" },
                                    { href: "/destinations", icon: Plane, label: `${destinations.length} Destinations`, desc: "Explore now" },
                                    { href: "/wildlife-insight", icon: Bird, label: "Wildlife", desc: "Real-time data" },
                                    { href: "/tribal-sync", icon: Users, label: `${tribeCount} Tribe Posts`, desc: "Community" },
                                ].map((item, i) => (
                                    <Link key={i} href={item.href}
                                        className="flex flex-col gap-2 p-4 rounded-xl border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group text-left">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                            <item.icon className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-white/80 group-hover:text-white transition-colors">{item.label}</div>
                                            <div className="text-[10px] text-white/30">{item.desc}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
