"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users, AlertTriangle, Shield, CheckCircle, LayoutDashboard,
    Map, Globe, Bird, LogOut, Menu, TrendingUp, TrendingDown,
    Settings, Bell, Search, Trash2, Edit, ChevronRight, Leaf,
    Activity, Server, Database, Zap, UserPlus, Compass,
    Filter, Eye, MoreVertical, Info, X, RefreshCw
} from "lucide-react"

const BACKEND = "https://tourify-backend-99ef.onrender.com"

const sidebarLinks = [
    { href: "/admin-dashboard", icon: LayoutDashboard, label: "Overview" },
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
    const [showNotif, setShowNotif] = useState(false)

    // Loading states
    const [loadingStats, setLoadingStats] = useState(true)
    const [loadingUsers, setLoadingUsers] = useState(true)
    const [error, setError] = useState<string>("")

    // Auth guard
    useEffect(() => {
        const userData = localStorage.getItem("user")
        const storedToken = localStorage.getItem("token")
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

    // Fetch notifications
    useEffect(() => {
        fetch(`${BACKEND}/api/notifications`)
            .then(r => r.json())
            .then(d => setNotifications(Array.isArray(d) ? d : []))
            .catch(() => setNotifications([]))
    }, [])

    // Delete user
    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return
        try {
            await fetch(`${BACKEND}/api/admin/users/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(prev => prev.filter(u => u._id !== id))
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
            setUsers(prev => prev.map(u => u._id === id ? { ...u, role: updated.role } : u))
        } catch {
            alert("Failed to update role")
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
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Leaf className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-white">Tourify<span className="text-emerald-400">.ai</span></div>
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
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                                    {user.name?.charAt(0) || "A"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white truncate">{user.name}</div>
                                    <div className="text-[10px] text-emerald-500 font-bold capitalize">{user.role}</div>
                                </div>
                                <button onClick={() => { localStorage.clear(); router.push("/login") }}
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
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
                                        {filteredUsers.map((u, i) => (
                                            <motion.tr key={u._id}
                                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}
                                                className="hover:bg-white/3 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/60 to-teal-600/60 flex items-center justify-center text-white text-xs font-bold shrink-0">
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
                                                        onChange={e => handleRoleChange(u._id, e.target.value)}
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
                                                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all" title="View">
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all" title="Delete">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
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
