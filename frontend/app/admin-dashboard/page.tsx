"use client"

import { useEffect, useState, Fragment } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users, AlertTriangle, Shield, CheckCircle, LayoutDashboard,
    Map, Globe, Bird, LogOut, Menu, TrendingUp, TrendingDown,
    Settings, Bell, Search, Trash2, Edit, ChevronRight, Leaf,
    Activity, Server, Database, Zap, UserPlus, Compass,
    Filter, Eye, MoreVertical, Info, X, RefreshCw, MapPin, Plus, Image, DollarSign, Tag,
    Radio, Lock, Unlock, Download
} from "lucide-react"
import { formatINR } from "@/lib/utils"

const BACKEND = "https://tourify-4cuu.onrender.com"

const sidebarLinks = [
    { href: "/admin-dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin-dashboard#offline-control", icon: Radio, label: "Offline Survival" },
    { href: "/destinations", icon: Map, label: "Destinations" },
    { href: "/nature-guard", icon: Shield, label: "Nature Guard" },
    { href: "/global-sanctuary", icon: Globe, label: "Sanctuary" },
    { href: "/wildlife-insight", icon: Bird, label: "Wildlife" },
    { href: "/profile", icon: Settings, label: "Settings" },
]

export default function AdminDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [token, setToken] = useState<string>("")
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [search, setSearch] = useState("")

    // Real data from API
    const [stats, setStats] = useState<any>(null)
    const [users, setUsers] = useState<any[]>([])
    const [notifications, setNotifications] = useState<any[]>([])
    const [bookings, setBookings] = useState<any[]>([])
    const [showNotif, setShowNotif] = useState(false)

    // Destinations management
    const [destinations, setDestinations] = useState<any[]>([])
    const [loadingDest, setLoadingDest] = useState(true)
    const [showAddPlace, setShowAddPlace] = useState(false)
    const [newPlace, setNewPlace] = useState({ name: "", country: "", price: "", category: "Nature", image: "", description: "", bestTime: "" })
    const [addingPlace, setAddingPlace] = useState(false)

    const [openDestId, setOpenDestId] = useState<string>("")
    const [destDraft, setDestDraft] = useState<any>(null)
    const [savingDestId, setSavingDestId] = useState<string>("")

    // Offline survival management
    const [offlinePacks, setOfflinePacks] = useState<any[]>([])
    const [offlineSummary, setOfflineSummary] = useState<any>(null)
    const [loadingOffline, setLoadingOffline] = useState(true)
    const [updatingOfflineId, setUpdatingOfflineId] = useState<string>("")

    // Loading states
    const [loadingStats, setLoadingStats] = useState(true)
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [error, setError] = useState<string>("")

    const [openUserId, setOpenUserId] = useState<string>("")
    const [userDetailsById, setUserDetailsById] = useState<Record<string, any>>({})
    const [loadingUserDetailsId, setLoadingUserDetailsId] = useState<string>("")

    // Auth guard
    useEffect(() => {
        const userData = sessionStorage.getItem("user")
        const storedToken = sessionStorage.getItem("token")
        if (userData && storedToken) {
            const parsed = JSON.parse(userData)
            if (parsed.role !== "admin") {
                router.push("/")
            } else {
                setUser(parsed)
                setToken(storedToken)
            }
        } else {
            router.push("/login")
        }
    }, [router])

    // Fetch admin stats
    useEffect(() => {
        if (!token) return
        setLoadingStats(true)
        fetch(`${BACKEND}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => { setStats(d); setLoadingStats(false) })
            .catch(() => { setError("Failed to load stats"); setLoadingStats(false) })
    }, [token])

    // Fetch all users
    useEffect(() => {
        if (!token) return
        setLoadingUsers(true)
        fetch(`${BACKEND}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => { setUsers(Array.isArray(d) ? d : []); setLoadingUsers(false) })
            .catch(() => { setLoadingUsers(false) })
    }, [token])

    // Fetch bookings
    useEffect(() => {
        if (!token) return
        fetch(`${BACKEND}/api/bookings/all`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => setBookings(Array.isArray(d) ? d : []))
            .catch(() => setBookings([]))
    }, [token])

    // Fetch destinations
    useEffect(() => {
        if (!token) return
        setLoadingDest(true)
        fetch(`${BACKEND}/api/admin/destinations`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => { setDestinations(Array.isArray(d) ? d : []); setLoadingDest(false) })
            .catch(() => setLoadingDest(false))
    }, [token])

    // Fetch notifications
    useEffect(() => {
        fetch(`${BACKEND}/api/notifications`)
            .then(r => r.json())
            .then(d => setNotifications(Array.isArray(d) ? d : []))
            .catch(() => setNotifications([]))
    }, [])

    // Fetch offline survival packs for admin control
    useEffect(() => {
        if (!token) return
        setLoadingOffline(true)
        fetch(`${BACKEND}/api/admin/offline-packs`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => {
                setOfflinePacks(Array.isArray(d?.packs) ? d.packs : [])
                setOfflineSummary(d?.summary || null)
                setLoadingOffline(false)
            })
            .catch(() => {
                setOfflinePacks([])
                setOfflineSummary(null)
                setLoadingOffline(false)
            })
    }, [token])

    // Delete user
    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return
        try {
            await fetch(`${BACKEND}/api/admin/users/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(prev => prev.filter(u => (u.id || u._id) !== id))
        } catch {
            alert("Failed to delete user")
        }
    }

    // Update role
    const handleRoleChange = async (id: string, role: string) => {
        try {
            const res = await fetch(`${BACKEND}/api/admin/users/${id}/role`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ role })
            })
            const updated = await res.json()
            setUsers(prev => prev.map(u => (u.id || u._id) === id ? { ...u, role: updated.role } : u))
        } catch {
            alert("Failed to update role")
        }
    }

    const getUserId = (u: any) => u?.id || u?._id || ""

    const toggleUserDetails = async (u: any) => {
        const id = getUserId(u)
        if (!id) return

        if (openUserId === id) {
            setOpenUserId("")
            return
        }

        setOpenUserId(id)
        if (userDetailsById[id]) return

        setLoadingUserDetailsId(id)
        try {
            const res = await fetch(`${BACKEND}/api/admin/users/${id}/details`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (!res.ok) {
                alert(data?.msg || "Failed to load user details")
                return
            }
            setUserDetailsById(prev => ({ ...prev, [id]: data }))
        } catch {
            alert("Failed to load user details")
        } finally {
            setLoadingUserDetailsId("")
        }
    }

    // Add destination
    const handleAddPlace = async () => {
        if (!newPlace.name || !newPlace.country || !newPlace.price || !newPlace.category) {
            alert("Name, country, price and category are required")
            return
        }
        setAddingPlace(true)
        try {
            const res = await fetch(`${BACKEND}/api/admin/destinations`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ ...newPlace, price: Number(newPlace.price) })
            })
            const created = await res.json()
            if (res.ok) {
                setDestinations(prev => [created, ...prev])
                setNewPlace({ name: "", country: "", price: "", category: "Nature", image: "", description: "", bestTime: "" })
                setShowAddPlace(false)
            } else {
                alert(created.msg || "Failed to add destination")
            }
        } catch {
            alert("Failed to add destination")
        } finally {
            setAddingPlace(false)
        }
    }

    // Delete destination
    const handleDeletePlace = async (id: string) => {
        if (!confirm("Are you sure you want to delete this destination?")) return
        try {
            await fetch(`${BACKEND}/api/admin/destinations/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            setDestinations(prev => prev.filter(d => d.id !== id))
        } catch {
            alert("Failed to delete destination")
        }
    }

    const openEditor = (d: any) => {
        const isClosing = openDestId === d.id
        if (isClosing) {
            setOpenDestId("")
            setDestDraft(null)
            return
        }

        setOpenDestId(d.id)
        setDestDraft({
            name: d.name || "",
            country: d.country || "",
            category: d.category || "",
            image: d.image || "",
            bestTime: d.bestTime || "",
            description: d.description || "",
            tags: Array.isArray(d.tags) ? d.tags.join(", ") : (d.tags ? String(d.tags) : ""),
            price: d.price ?? 0,
            rating: d.rating ?? 4.5,
            itinerary: Array.isArray(d.itinerary) ? d.itinerary : [],
        })
    }

    const handleSaveDestination = async (id: string) => {
        if (!destDraft) return
        setSavingDestId(id)
        try {
            const normalizedTags = String(destDraft.tags || "")
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean)

            const normalizedItinerary = (Array.isArray(destDraft.itinerary) ? destDraft.itinerary : []).map((day: any, idx: number) => {
                const items = (Array.isArray(day?.items) ? day.items : []).map((it: any) => {
                    const costStr = it?.cost
                    const costNum = costStr === "" || costStr === null || costStr === undefined ? undefined : Number(costStr)
                    return {
                        time: it?.time || "",
                        title: it?.title || "",
                        ...(Number.isFinite(costNum as any) ? { cost: costNum } : {}),
                    }
                })

                return {
                    day: idx + 1,
                    date: day?.date || "",
                    title: day?.title || "",
                    items,
                }
            })

            const payload = {
                name: String(destDraft.name || "").trim(),
                country: String(destDraft.country || "").trim(),
                category: String(destDraft.category || "").trim(),
                image: String(destDraft.image || "").trim(),
                bestTime: String(destDraft.bestTime || "").trim(),
                description: String(destDraft.description || ""),
                tags: normalizedTags,
                price: Number(destDraft.price) || 0,
                rating: Number(destDraft.rating) || 0,
                itinerary: normalizedItinerary,
            }

            const res = await fetch(`${BACKEND}/api/admin/destinations/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            const updated = await res.json()
            if (!res.ok) {
                alert(updated?.msg || "Failed to save destination")
                return
            }
            setDestinations(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d))
            setOpenDestId("")
            setDestDraft(null)
        } catch {
            alert("Failed to save destination")
        } finally {
            setSavingDestId("")
        }
    }

    const addItineraryDay = () => {
        setDestDraft((prev: any) => {
            const itinerary = Array.isArray(prev?.itinerary) ? prev.itinerary : []
            const nextDay = itinerary.length + 1
            return { ...prev, itinerary: [...itinerary, { day: nextDay, date: "", title: "", items: [] }] }
        })
    }

    const removeItineraryDay = (dayIndex: number) => {
        setDestDraft((prev: any) => {
            const itinerary = Array.isArray(prev?.itinerary) ? prev.itinerary : []
            const next = itinerary.filter((_: any, idx: number) => idx !== dayIndex)
                .map((d: any, idx: number) => ({ ...d, day: idx + 1 }))
            return { ...prev, itinerary: next }
        })
    }

    const updateDayField = (dayIndex: number, field: string, value: any) => {
        setDestDraft((prev: any) => {
            const itinerary = Array.isArray(prev?.itinerary) ? prev.itinerary : []
            const next = itinerary.map((d: any, idx: number) => idx === dayIndex ? { ...d, [field]: value } : d)
            return { ...prev, itinerary: next }
        })
    }

    const addDayItem = (dayIndex: number) => {
        setDestDraft((prev: any) => {
            const itinerary = Array.isArray(prev?.itinerary) ? prev.itinerary : []
            const next = itinerary.map((d: any, idx: number) => {
                if (idx !== dayIndex) return d
                const items = Array.isArray(d.items) ? d.items : []
                return { ...d, items: [...items, { time: "", title: "", cost: "" }] }
            })
            return { ...prev, itinerary: next }
        })
    }

    const removeDayItem = (dayIndex: number, itemIndex: number) => {
        setDestDraft((prev: any) => {
            const itinerary = Array.isArray(prev?.itinerary) ? prev.itinerary : []
            const next = itinerary.map((d: any, idx: number) => {
                if (idx !== dayIndex) return d
                const items = Array.isArray(d.items) ? d.items : []
                return { ...d, items: items.filter((_: any, ii: number) => ii !== itemIndex) }
            })
            return { ...prev, itinerary: next }
        })
    }

    const updateDayItemField = (dayIndex: number, itemIndex: number, field: string, value: any) => {
        setDestDraft((prev: any) => {
            const itinerary = Array.isArray(prev?.itinerary) ? prev.itinerary : []
            const next = itinerary.map((d: any, idx: number) => {
                if (idx !== dayIndex) return d
                const items = Array.isArray(d.items) ? d.items : []
                return { ...d, items: items.map((it: any, ii: number) => ii === itemIndex ? { ...it, [field]: value } : it) }
            })
            return { ...prev, itinerary: next }
        })
    }

    // Update booking status
    const handleBookingStatus = async (id: string, status: string) => {
        try {
            await fetch(`${BACKEND}/api/bookings/${id}/status`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            })
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
        } catch {
            alert("Failed to update booking status")
        }
    }

    const handleOfflineUpdate = async (packId: string, payload: any) => {
        try {
            setUpdatingOfflineId(packId)
            const res = await fetch(`${BACKEND}/api/admin/offline-packs/${packId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            if (!res.ok) throw new Error("Update failed")
            const updated = await res.json()

            setOfflinePacks(prev => prev.map(p => p.id === packId ? {
                ...p,
                enabled: updated.enabled ?? p.enabled,
                isPublic: updated.isPublic ?? p.isPublic,
                packSizeMB: updated.packSizeMB ?? p.packSizeMB,
                packVersion: updated.packVersion ?? p.packVersion,
                updatedAt: updated.updatedAt ?? p.updatedAt,
                updatedBy: updated.updatedBy ?? p.updatedBy,
            } : p))

            // Keep summary in sync instantly
            setOfflineSummary((prev: any) => {
                if (!prev) return prev
                const nextPacks = offlinePacks.map(p => p.id === packId ? { ...p, ...payload } : p)
                return {
                    ...prev,
                    enabled: nextPacks.filter(p => p.enabled !== false).length,
                    publicCount: nextPacks.filter(p => p.isPublic !== false).length,
                    disabled: nextPacks.filter(p => p.enabled === false).length,
                    privateCount: nextPacks.filter(p => p.isPublic === false).length,
                }
            })
        } catch {
            alert("Failed to update offline pack settings")
        } finally {
            setUpdatingOfflineId("")
        }
    }

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    )

    const unreadCount = notifications.filter(n => !n.isRead).length

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
                        <div className="p-6 border-b border-white/5">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Leaf className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-white">Tourifyy</div>
                                    <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Admin Portal</div>
                                </div>
                            </Link>
                        </div>

                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {sidebarLinks.map((link) => (
                                <Link key={link.href} href={link.href}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-white/50 hover:text-white hover:bg-white/5">
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-white/5">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                                    {user.name?.charAt(0) || "A"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white truncate">{user.name}</div>
                                    <div className="text-[10px] text-emerald-500 font-bold capitalize">{user.role}</div>
                                </div>
                                <button onClick={() => { sessionStorage.clear(); router.push("/login") }}
                                    className="text-white/30 hover:text-red-400 transition-colors">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 border-b border-white/5 backdrop-blur-xl bg-[hsl(145,25%,6%)]/80">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2 border border-white/5 w-64">
                            <Search className="w-4 h-4 text-white/30" />
                            <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
                                className="bg-transparent text-sm text-white/70 placeholder-white/30 outline-none flex-1" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <button onClick={() => setShowNotif(!showNotif)}
                                className="relative p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-all">
                                <Bell className="w-4 h-4" />
                                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
                            </button>
                            <AnimatePresence>
                                {showNotif && (
                                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                                        style={{ background: "hsl(145,28%,8%)" }}>
                                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                                            <h3 className="text-sm font-bold text-white">Notifications</h3>
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
                                                <div className="p-8 text-center text-xs text-white/30">No notifications found</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button onClick={() => { setLoadingStats(true); setLoadingUsers(true); }}
                            className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-all">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                            {user.name?.charAt(0) || "A"}
                        </div>
                    </div>
                </header>

                <main className="p-6 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                        <p className="text-sm text-white/40 mt-1">Welcome back, {user.name}. Real-time platform data.</p>
                    </motion.div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                    )}

                    {/* Stats Cards — real data */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {loadingStats ? Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-2xl p-5 border border-white/5 animate-pulse"
                                style={{ background: "rgba(255,255,255,0.03)" }}>
                                <div className="w-10 h-10 rounded-xl bg-white/5 mb-4" />
                                <div className="h-7 w-16 rounded-lg bg-white/5 mb-2" />
                                <div className="h-3 w-24 rounded bg-white/5" />
                            </div>
                        )) : [
                            { label: "Total Users", value: stats?.userCount ?? 0, icon: Users, color: "emerald", sub: `${stats?.adminCount ?? 0} admins · ${stats?.customerCount ?? 0} explorers` },
                            { label: "Active Alerts", value: stats?.activeAlerts ?? 0, icon: AlertTriangle, color: "amber", sub: "Nature Guard warnings" },
                            { label: "Eco Certifications", value: stats?.certifications ?? 0, icon: Shield, color: "teal", sub: "Verified sanctuaries" },
                            { label: "System Status", value: stats?.systemStatus ?? "—", icon: CheckCircle, color: "emerald", sub: "All services" },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}
                                className="rounded-2xl p-5 border border-white/5 hover:border-emerald-500/20 transition-all"
                                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}>
                                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-4`}>
                                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-white/40">{stat.label}</div>
                                <div className="text-[10px] text-white/25 mt-1">{stat.sub}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Destinations Management */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        className="rounded-2xl border border-white/5 overflow-hidden"
                        style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}>
                        <div className="flex items-center justify-between p-5 border-b border-white/5">
                            <h2 className="font-bold text-white text-sm flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-emerald-400" /> Manage Destinations
                                <span className="text-[10px] text-white/30 font-normal ml-1">({destinations.length} places)</span>
                            </h2>
                            <button onClick={() => setShowAddPlace(!showAddPlace)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all">
                                <Plus className="w-3 h-3" /> Add Place
                            </button>
                        </div>

                        {/* Add Place Form */}
                        <AnimatePresence>
                            {showAddPlace && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                    className="border-b border-white/5 overflow-hidden">
                                    <div className="p-5 space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Name *</label>
                                                <input value={newPlace.name} onChange={e => setNewPlace({ ...newPlace, name: e.target.value })}
                                                    placeholder="e.g. Bali Rainforest" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Country *</label>
                                                <input value={newPlace.country} onChange={e => setNewPlace({ ...newPlace, country: e.target.value })}
                                                    placeholder="e.g. Indonesia" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Price (₹) *</label>
                                                <input type="number" value={newPlace.price} onChange={e => setNewPlace({ ...newPlace, price: e.target.value })}
                                                    placeholder="e.g. 1500" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Category *</label>
                                                <select value={newPlace.category} onChange={e => setNewPlace({ ...newPlace, category: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-emerald-500/50">
                                                    <option value="Nature">Nature</option>
                                                    <option value="Beach">Beach</option>
                                                    <option value="City">City</option>
                                                    <option value="Mountain">Mountain</option>
                                                    <option value="Desert">Desert</option>
                                                    <option value="Cultural">Cultural</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Image URL</label>
                                                <input value={newPlace.image} onChange={e => setNewPlace({ ...newPlace, image: e.target.value })}
                                                    placeholder="https://..." className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Best Time</label>
                                                <input value={newPlace.bestTime} onChange={e => setNewPlace({ ...newPlace, bestTime: e.target.value })}
                                                    placeholder="e.g. Jun - Sep" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Description</label>
                                            <textarea value={newPlace.description} onChange={e => setNewPlace({ ...newPlace, description: e.target.value })}
                                                placeholder="A short description of the destination..." rows={2}
                                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50 resize-none" />
                                        </div>
                                        <div className="flex items-center gap-3 pt-1">
                                            <button onClick={handleAddPlace} disabled={addingPlace}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all disabled:opacity-50">
                                                {addingPlace ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                                {addingPlace ? "Adding..." : "Add Destination"}
                                            </button>
                                            <button onClick={() => setShowAddPlace(false)}
                                                className="px-4 py-2 rounded-lg bg-white/5 text-white/50 text-xs font-medium hover:bg-white/10 transition-all">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Destinations List */}
                        {loadingDest ? (
                            <div className="p-8 flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs text-white/30">Loading destinations...</p>
                            </div>
                        ) : destinations.length === 0 ? (
                            <div className="p-8 text-center text-sm text-white/30">No destinations found. Add your first place!</div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {destinations.map((d, i) => (
                                    <div key={d.id}>
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.03 * i }}
                                            onClick={() => openEditor(d)}
                                            className="flex items-center justify-between p-4 hover:bg-white/2 transition-colors group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0">
                                                    {d.image ? (
                                                        <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><Image className="w-5 h-5 text-white/20" /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                                                        {d.name}
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/35">Click to edit</span>
                                                    </div>
                                                    <div className="text-xs text-white/40 flex items-center gap-2">
                                                        <span>{d.country}</span>
                                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                                        <span>{d.category}</span>
                                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                                        <span>{formatINR(d.price)}</span>
                                                        {d.rating !== undefined && d.rating !== null && (
                                                            <>
                                                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                                                <span>{Number(d.rating).toFixed(1)}★</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    {d.createdBy && (
                                                        <div className="text-[10px] text-white/30 flex items-center gap-1.5 mt-1">
                                                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[9px]">
                                                                {d.createdBy.name?.charAt(0).toUpperCase()}
                                                            </span>
                                                            <span>Added by {d.createdBy.name}</span>
                                                            {d.createdAt && (
                                                                <>
                                                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                                                    <span>{new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openEditor(d) }}
                                                    className="p-2 rounded-lg hover:bg-emerald-500/10 text-white/30 hover:text-emerald-300 transition-all opacity-0 group-hover:opacity-100"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeletePlace(d.id) }}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>

                                        <AnimatePresence>
                                            {openDestId === d.id && destDraft && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden border-t border-white/5"
                                                >
                                                    <div className="p-5 bg-white/[0.02]">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                                            <div>
                                                                <div className="text-sm font-bold text-white">Edit Destination</div>
                                                                <div className="text-[11px] text-white/35">Update location details, price/rating, and a day-wise itinerary (time + place/activity + cost).</div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleSaveDestination(d.id)}
                                                                    disabled={savingDestId === d.id}
                                                                    className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all disabled:opacity-50"
                                                                >
                                                                    {savingDestId === d.id ? "Saving..." : "Save"}
                                                                </button>
                                                                <button
                                                                    onClick={() => { setOpenDestId(""); setDestDraft(null) }}
                                                                    className="px-4 py-2 rounded-lg bg-white/5 text-white/50 text-xs font-medium hover:bg-white/10 transition-all"
                                                                >
                                                                    Close
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Name</label>
                                                                <input
                                                                    value={destDraft.name || ""}
                                                                    onChange={(e) => setDestDraft((p: any) => ({ ...p, name: e.target.value }))}
                                                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Country</label>
                                                                <input
                                                                    value={destDraft.country || ""}
                                                                    onChange={(e) => setDestDraft((p: any) => ({ ...p, country: e.target.value }))}
                                                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Category</label>
                                                                <input
                                                                    value={destDraft.category || ""}
                                                                    onChange={(e) => setDestDraft((p: any) => ({ ...p, category: e.target.value }))}
                                                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Image URL</label>
                                                                <input
                                                                    value={destDraft.image || ""}
                                                                    onChange={(e) => setDestDraft((p: any) => ({ ...p, image: e.target.value }))}
                                                                    placeholder="https://..."
                                                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Best Time</label>
                                                                <input
                                                                    value={destDraft.bestTime || ""}
                                                                    onChange={(e) => setDestDraft((p: any) => ({ ...p, bestTime: e.target.value }))}
                                                                    placeholder="e.g. Jun - Sep"
                                                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Tags (comma-separated)</label>
                                                                <input
                                                                    value={destDraft.tags || ""}
                                                                    onChange={(e) => setDestDraft((p: any) => ({ ...p, tags: e.target.value }))}
                                                                    placeholder="Nature, Trek, Culture"
                                                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1 mb-4">
                                                            <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Description</label>
                                                            <textarea
                                                                value={destDraft.description || ""}
                                                                onChange={(e) => setDestDraft((p: any) => ({ ...p, description: e.target.value }))}
                                                                rows={2}
                                                                placeholder="A short description of the destination..."
                                                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50 resize-none"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Price (₹)</label>
                                                                <input
                                                                    type="number"
                                                                    value={destDraft.price}
                                                                    onChange={(e) => setDestDraft((p: any) => ({ ...p, price: e.target.value }))}
                                                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Rating</label>
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    value={destDraft.rating}
                                                                    onChange={(e) => setDestDraft((p: any) => ({ ...p, rating: e.target.value }))}
                                                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between gap-3 mb-3">
                                                            <div className="text-xs font-bold text-white/70">Day-wise Itinerary</div>
                                                            <button
                                                                onClick={addItineraryDay}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
                                                            >
                                                                <Plus className="w-3 h-3" /> Add Day
                                                            </button>
                                                        </div>

                                                        <div className="space-y-4">
                                                            {(Array.isArray(destDraft.itinerary) ? destDraft.itinerary : []).length === 0 ? (
                                                                <div className="p-4 rounded-xl border border-white/5 bg-white/2 text-xs text-white/35">No itinerary yet. Click “Add Day”.</div>
                                                            ) : (
                                                                (destDraft.itinerary as any[]).map((day, dayIndex) => (
                                                                    <div key={dayIndex} className="rounded-2xl border border-white/5 overflow-hidden">
                                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 bg-white/[0.02] border-b border-white/5">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold">{dayIndex + 1}</span>
                                                                                <span className="text-sm font-bold text-white">Day {dayIndex + 1}</span>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => removeItineraryDay(dayIndex)}
                                                                                className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium hover:bg-red-500/15 transition-all w-fit"
                                                                            >
                                                                                Remove Day
                                                                            </button>
                                                                        </div>

                                                                        <div className="p-4 space-y-3">
                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                                <div className="space-y-1">
                                                                                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Date (optional)</label>
                                                                                    <input
                                                                                        value={day.date || ""}
                                                                                        onChange={(e) => updateDayField(dayIndex, "date", e.target.value)}
                                                                                        placeholder="Apr 1, 2026"
                                                                                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                                    />
                                                                                </div>
                                                                                <div className="space-y-1 lg:col-span-2">
                                                                                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/30">Day Title</label>
                                                                                    <input
                                                                                        value={day.title || ""}
                                                                                        onChange={(e) => updateDayField(dayIndex, "title", e.target.value)}
                                                                                        placeholder="Arrival / City tour / Nature day..."
                                                                                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex items-center justify-between gap-3">
                                                                                <div className="text-[11px] text-white/35 font-bold uppercase tracking-wider">Places / Activities</div>
                                                                                <button
                                                                                    onClick={() => addDayItem(dayIndex)}
                                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:bg-white/10 transition-all"
                                                                                >
                                                                                    <Plus className="w-3 h-3" /> Add Place
                                                                                </button>
                                                                            </div>

                                                                            <div className="space-y-2">
                                                                                {(Array.isArray(day.items) ? day.items : []).length === 0 ? (
                                                                                    <div className="p-3 rounded-xl border border-white/5 bg-white/2 text-xs text-white/35">No places added for this day.</div>
                                                                                ) : (
                                                                                    (day.items as any[]).map((it, itemIndex) => (
                                                                                        <div key={itemIndex} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                                                                                            <input
                                                                                                value={it.time || ""}
                                                                                                onChange={(e) => updateDayItemField(dayIndex, itemIndex, "time", e.target.value)}
                                                                                                placeholder="10:00 AM"
                                                                                                className="sm:col-span-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                                            />
                                                                                            <input
                                                                                                value={it.title || ""}
                                                                                                onChange={(e) => updateDayItemField(dayIndex, itemIndex, "title", e.target.value)}
                                                                                                placeholder="Arrive / Check-in / Explore..."
                                                                                                className="sm:col-span-7 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                                            />
                                                                                            <input
                                                                                                type="number"
                                                                                                value={it.cost ?? ""}
                                                                                                onChange={(e) => updateDayItemField(dayIndex, itemIndex, "cost", e.target.value)}
                                                                                                placeholder="₹"
                                                                                                className="sm:col-span-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500/50"
                                                                                            />
                                                                                            <button
                                                                                                onClick={() => removeDayItem(dayIndex, itemIndex)}
                                                                                                className="sm:col-span-1 p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-300 transition-all"
                                                                                                title="Remove"
                                                                                            >
                                                                                                <Trash2 className="w-4 h-4" />
                                                                                            </button>
                                                                                        </div>
                                                                                    ))
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Offline Survival Access Control */}
                    <motion.div
                        id="offline-control"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                        className="rounded-2xl border border-white/5 overflow-hidden"
                        style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}
                    >
                        <div className="p-5 border-b border-white/5">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="font-bold text-white text-sm flex items-center gap-2">
                                    <Radio className="w-4 h-4 text-amber-400" /> Offline Survival Control Center
                                </h2>
                                <a
                                    href="/offline-survival"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 transition-all"
                                >
                                    Open User Page
                                </a>
                            </div>

                            <p className="text-xs text-white/40 mt-2">
                                Admin can view all packs, disable a destination pack, and switch between Public and Private access.
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                                <div className="rounded-xl border border-white/5 p-3 bg-white/2">
                                    <div className="text-[10px] text-white/35 uppercase tracking-wider">Total Packs</div>
                                    <div className="text-lg font-bold text-white mt-0.5">{offlineSummary?.total ?? offlinePacks.length}</div>
                                </div>
                                <div className="rounded-xl border border-emerald-500/20 p-3 bg-emerald-500/10">
                                    <div className="text-[10px] text-emerald-300 uppercase tracking-wider">Enabled</div>
                                    <div className="text-lg font-bold text-emerald-300 mt-0.5">{offlineSummary?.enabled ?? 0}</div>
                                </div>
                                <div className="rounded-xl border border-red-500/20 p-3 bg-red-500/10">
                                    <div className="text-[10px] text-red-300 uppercase tracking-wider">Disabled</div>
                                    <div className="text-lg font-bold text-red-300 mt-0.5">{offlineSummary?.disabled ?? 0}</div>
                                </div>
                                <div className="rounded-xl border border-blue-500/20 p-3 bg-blue-500/10">
                                    <div className="text-[10px] text-blue-300 uppercase tracking-wider">Private</div>
                                    <div className="text-lg font-bold text-blue-300 mt-0.5">{offlineSummary?.privateCount ?? 0}</div>
                                </div>
                            </div>
                        </div>

                        {loadingOffline ? (
                            <div className="p-8 flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs text-white/30">Loading offline packs...</p>
                            </div>
                        ) : offlinePacks.length === 0 ? (
                            <div className="p-8 text-center text-sm text-white/30">No offline packs available yet.</div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {offlinePacks.map((pack, i) => (
                                    <motion.div
                                        key={pack.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.02 * i }}
                                        className="p-4 hover:bg-white/2 transition-colors"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                            <div>
                                                <div className="text-sm font-semibold text-white flex items-center gap-2">
                                                    {pack.name}
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">
                                                        {pack.country}
                                                    </span>
                                                </div>
                                                <div className="text-[11px] text-white/40 mt-1 flex flex-wrap gap-2">
                                                    <span>{pack.category}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><Download className="w-3 h-3" />{pack.packSizeMB} MB</span>
                                                    <span>•</span>
                                                    <span>v{pack.packVersion}</span>
                                                    <span>•</span>
                                                    <span>{pack.languagesCount} languages</span>
                                                    <span>•</span>
                                                    <span>{pack.firstAidGuideCount} first-aid guides</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <button
                                                    onClick={() => handleOfflineUpdate(pack.id, { enabled: !pack.enabled })}
                                                    disabled={updatingOfflineId === pack.id}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${pack.enabled
                                                        ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20"
                                                        : "bg-red-500/10 text-red-300 border-red-500/20 hover:bg-red-500/20"}`}
                                                >
                                                    {pack.enabled ? "Enabled" : "Disabled"}
                                                </button>

                                                <button
                                                    onClick={() => handleOfflineUpdate(pack.id, { isPublic: !pack.isPublic })}
                                                    disabled={updatingOfflineId === pack.id}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${pack.isPublic
                                                        ? "bg-blue-500/10 text-blue-300 border-blue-500/20 hover:bg-blue-500/20"
                                                        : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"}`}
                                                >
                                                    {pack.isPublic ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                                    {pack.isPublic ? "Public" : "Private"}
                                                </button>

                                                <input
                                                    value={pack.packVersion}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                        setOfflinePacks(prev => prev.map(p => p.id === pack.id ? { ...p, packVersion: value } : p))
                                                    }}
                                                    className="w-20 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none"
                                                    placeholder="v1.2.0"
                                                />
                                                <button
                                                    onClick={() => handleOfflineUpdate(pack.id, { packVersion: pack.packVersion })}
                                                    disabled={updatingOfflineId === pack.id}
                                                    className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-white/10"
                                                >
                                                    Save Ver
                                                </button>

                                                <input
                                                    type="number"
                                                    min={20}
                                                    max={500}
                                                    value={pack.packSizeMB}
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value || 0)
                                                        setOfflinePacks(prev => prev.map(p => p.id === pack.id ? { ...p, packSizeMB: value } : p))
                                                    }}
                                                    className="w-20 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white outline-none"
                                                />
                                                <button
                                                    onClick={() => handleOfflineUpdate(pack.id, { packSizeMB: pack.packSizeMB })}
                                                    disabled={updatingOfflineId === pack.id}
                                                    className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-white/10"
                                                >
                                                    Save MB
                                                </button>
                                            </div>
                                        </div>

                                        {(pack.updatedAt || pack.updatedBy) && (
                                            <div className="text-[10px] text-white/30 mt-2">
                                                Last updated: {pack.updatedAt ? new Date(pack.updatedAt).toLocaleString() : "—"} {pack.updatedBy ? `by ${pack.updatedBy}` : ""}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Users Table — real data */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="rounded-2xl border border-white/5 overflow-hidden"
                        style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}>
                        <div className="flex items-center justify-between p-5 border-b border-white/5">
                            <h2 className="font-bold text-white text-sm flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-400" /> All Users
                                <span className="text-[10px] text-white/30 font-normal ml-1">({filteredUsers.length} total)</span>
                            </h2>
                            <div className="flex items-center gap-2">
                                <Link href="/signup">
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all">
                                        <UserPlus className="w-3 h-3" /> Add User
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {loadingUsers ? (
                            <div className="p-8 flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-xs text-white/30">Loading users from database...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-8 text-center text-sm text-white/30">
                                {search ? "No users match your search." : "No users found in the database."}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left px-5 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">User</th>
                                            <th className="text-left px-5 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider hidden sm:table-cell">Role</th>
                                            <th className="text-left px-5 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider hidden md:table-cell">Joined</th>
                                            <th className="text-right px-5 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredUsers.map((u, i) => {
                                            const uid = getUserId(u)
                                            const isOpen = openUserId === uid
                                            const details = uid ? userDetailsById[uid] : null
                                            const isLoadingDetails = loadingUserDetailsId === uid

                                            return (
                                            <Fragment key={uid || i}>
                                            <motion.tr key={uid || i}
                                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}
                                                className="hover:bg-white/3 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-500/60 to-teal-600/60 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                            {u.name?.charAt(0)?.toUpperCase() || "?"}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-white">{u.name}</div>
                                                            <div className="text-xs text-white/30">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 hidden sm:table-cell">
                                                    <select
                                                        value={u.role}
                                                        onChange={e => handleRoleChange(uid, e.target.value)}
                                                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border bg-transparent cursor-pointer outline-none ${u.role === "admin"
                                                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                                                        <option value="customer">Explorer</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-5 py-4 text-xs text-white/40 hidden md:table-cell">
                                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" }) : "—"}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => toggleUserDetails(u)}
                                                            className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${isOpen ? "text-emerald-300" : "text-white/40 hover:text-white"}`}
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(uid)}
                                                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all" title="Delete">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.tr
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="bg-white/[0.02]"
                                                    >
                                                        <td colSpan={4} className="px-5 pb-5 pt-2">
                                                            <div className="rounded-2xl border border-white/5 p-4">
                                                                {isLoadingDetails && (
                                                                    <div className="flex items-center gap-3 text-xs text-white/40">
                                                                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                                                        Loading user details...
                                                                    </div>
                                                                )}

                                                                {!isLoadingDetails && details && (
                                                                    <div className="space-y-4">
                                                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                                            <div>
                                                                                <div className="text-sm font-bold text-white">User Details</div>
                                                                                <div className="text-[11px] text-white/35">Account info + planned trips (bookings) + itinerary.</div>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => setOpenUserId("")}
                                                                                className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs font-medium hover:bg-white/10 transition-all w-fit"
                                                                            >
                                                                                Close
                                                                            </button>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                                            <div className="p-3 rounded-xl border border-white/5 bg-white/2">
                                                                                <div className="text-[10px] text-white/35 uppercase tracking-wider">Joined</div>
                                                                                <div className="text-sm font-bold text-white mt-0.5">
                                                                                    {details.user?.createdAt ? new Date(details.user.createdAt).toLocaleString() : "—"}
                                                                                </div>
                                                                            </div>
                                                                            <div className="p-3 rounded-xl border border-white/5 bg-white/2">
                                                                                <div className="text-[10px] text-white/35 uppercase tracking-wider">Phone</div>
                                                                                <div className="text-sm font-bold text-white mt-0.5">{details.user?.phone || "—"}</div>
                                                                            </div>
                                                                            <div className="p-3 rounded-xl border border-white/5 bg-white/2">
                                                                                <div className="text-[10px] text-white/35 uppercase tracking-wider">Location</div>
                                                                                <div className="text-sm font-bold text-white mt-0.5">{details.user?.location || "—"}</div>
                                                                            </div>
                                                                            <div className="p-3 rounded-xl border border-white/5 bg-white/2">
                                                                                <div className="text-[10px] text-white/35 uppercase tracking-wider">Bookings</div>
                                                                                <div className="text-sm font-bold text-white mt-0.5">{details.summary?.total ?? 0}</div>
                                                                                <div className="text-[10px] text-white/30 mt-0.5">Total spent: {formatINR(Number(details.summary?.totalCost || 0))}</div>
                                                                            </div>
                                                                        </div>

                                                                        <div>
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <div className="text-xs font-bold text-white/70">Planned Trips / Bookings</div>
                                                                                <div className="text-[10px] text-white/30">Newest first</div>
                                                                            </div>

                                                                            {Array.isArray(details.bookings) && details.bookings.length === 0 ? (
                                                                                <div className="p-4 rounded-xl border border-white/5 bg-white/2 text-xs text-white/35">No bookings found for this user.</div>
                                                                            ) : (
                                                                                <div className="space-y-2">
                                                                                    {(details.bookings || []).slice(0, 10).map((b: any) => (
                                                                                        <div key={b.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                                                                <div>
                                                                                                    <div className="text-sm font-semibold text-white/85">{b.destination || "—"}</div>
                                                                                                    <div className="text-[11px] text-white/35 mt-0.5">
                                                                                                        {b.startDate || "—"}{b.endDate ? ` → ${b.endDate}` : ""} · {b.travelers ? `${b.travelers} travelers` : ""}
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${b.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : b.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                                                                        {b.status || 'pending'}
                                                                                                    </span>
                                                                                                    <span className="text-xs font-bold text-emerald-300">{formatINR(Number(b.totalCost || 0))}</span>
                                                                                                </div>
                                                                                            </div>

                                                                                            {Array.isArray(b.itinerary) && b.itinerary.length > 0 && (
                                                                                                <div className="mt-3">
                                                                                                    <div className="text-[10px] text-white/35 uppercase tracking-wider font-bold mb-2">Itinerary</div>
                                                                                                    <div className="space-y-1.5">
                                                                                                        {b.itinerary.slice(0, 5).map((it: any, idx: number) => (
                                                                                                            <div key={idx} className="text-xs text-white/60">
                                                                                                                {typeof it === "string" ? it : (it?.title || it?.activity || it?.place || JSON.stringify(it))}
                                                                                                            </div>
                                                                                                        ))}
                                                                                                        {b.itinerary.length > 5 && (
                                                                                                            <div className="text-[11px] text-white/30">+{b.itinerary.length - 5} more...</div>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    ))}
                                                                                    {(details.bookings || []).length > 10 && (
                                                                                        <div className="text-[11px] text-white/30">Showing latest 10 bookings.</div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                )}
                                            </AnimatePresence>
                                            </Fragment>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>

                    {/* Booking Requests — real data */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        className="rounded-2xl border border-white/5 p-5"
                        style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-bold text-white text-sm flex items-center gap-2">
                                <Compass className="w-4 h-4 text-emerald-400" /> Booking Requests
                                <span className="text-[10px] text-white/30 font-normal">({bookings.length} total)</span>
                            </h2>
                        </div>
                        {bookings.length === 0 ? (
                            <p className="text-xs text-white/30 text-center py-6">No booking requests found.</p>
                        ) : (
                            <div className="space-y-3">
                                {bookings.slice(0, 5).map((b, i) => (
                                    <motion.div key={b.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}
                                        className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                <MapPin className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white/80">{b.destination}</p>
                                                <p className="text-[11px] text-white/40">{b.userName} · {b.travelers} travelers · {formatINR(b.totalCost)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${b.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : b.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                {b.status || 'pending'}
                                            </span>
                                            {b.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleBookingStatus(b.id, 'approved')} className="p-1 px-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-[10px] font-bold transition-all">Approve</button>
                                                    <button onClick={() => handleBookingStatus(b.id, 'rejected')} className="p-1 px-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-[10px] font-bold transition-all">Reject</button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Notifications — real data */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="rounded-2xl border border-white/5 p-5"
                        style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-bold text-white text-sm flex items-center gap-2">
                                <Bell className="w-4 h-4 text-emerald-400" /> Platform Notifications
                                <span className="text-[10px] text-white/30 font-normal">({notifications.length})</span>
                            </h2>
                        </div>
                        {notifications.length === 0 ? (
                            <p className="text-xs text-white/30 text-center py-6">No notifications found.</p>
                        ) : (
                            <div className="space-y-3">
                                {notifications.slice(0, 6).map((n, i) => (
                                    <motion.div key={n._id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}
                                        className="flex items-start gap-3 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === "alert" ? "bg-amber-500/10" : n.type === "success" ? "bg-emerald-500/10" : "bg-blue-500/10"}`}>
                                            {n.type === "alert" ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> :
                                                n.type === "success" ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> :
                                                    <Info className="w-3.5 h-3.5 text-blue-400" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-white/80">{n.title}</p>
                                            <p className="text-[11px] text-white/40 mt-0.5 line-clamp-2">{n.message}</p>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${n.type === "alert" ? "bg-amber-500/10 text-amber-400" : n.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"}`}>
                                            {n.type}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
