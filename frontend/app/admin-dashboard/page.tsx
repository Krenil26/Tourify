"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users, AlertTriangle, Shield, CheckCircle, LayoutDashboard,
    Map, Globe, Bird, LogOut, Menu, X, TrendingUp, TrendingDown,
    Settings, Bell, Search, MoreVertical, Eye, Trash2, Edit,
    ChevronRight, Leaf, Activity, Server, Database, Zap,
    Download, Filter, UserPlus, Star, Compass, RefreshCw
} from "lucide-react"

const BACKEND = "https://tourify-backend-99ef.onrender.com"

const sidebarLinks = [
    { href: "/admin-dashboard", icon: LayoutDashboard, label: "Overview", active: true },
    { href: "/admin-dashboard/users", icon: Users, label: "Users" },
    { href: "/destinations", icon: Map, label: "Destinations" },
    { href: "/nature-guard", icon: Shield, label: "Nature Guard" },
    { href: "/global-sanctuary", icon: Globe, label: "Sanctuary" },
    { href: "/wildlife-insight", icon: Bird, label: "Wildlife" },
    { href: "/admin-dashboard/settings", icon: Settings, label: "Settings" },
]

const mockUsers = [
    { id: 1, name: "Alex Johnson", email: "alex@mail.com", role: "Explorer", status: "active", trips: 12, joined: "Jan 2025", avatar: "AJ" },
    { id: 2, name: "Priya Sharma", email: "priya@mail.com", role: "Admin", status: "active", trips: 3, joined: "Feb 2025", avatar: "PS" },
    { id: 3, name: "Liam Chen", email: "liam@mail.com", role: "Explorer", status: "inactive", trips: 7, joined: "Dec 2024", avatar: "LC" },
    { id: 4, name: "Sara Mbeki", email: "sara@mail.com", role: "Explorer", status: "active", trips: 22, joined: "Mar 2025", avatar: "SM" },
    { id: 5, name: "Omar Hussain", email: "omar@mail.com", role: "Explorer", status: "active", trips: 5, joined: "Nov 2024", avatar: "OH" },
]

const recentActivity = [
    { icon: UserPlus, color: "text-emerald-400", bg: "bg-emerald-500/10", text: "New user Sara Mbeki joined", time: "2 min ago" },
    { icon: Map, color: "text-blue-400", bg: "bg-blue-500/10", text: "Destination 'Bali' updated by admin", time: "15 min ago" },
    { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", text: "Nature alert triggered in Amazon", time: "1 hr ago" },
    { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", text: "Eco certification approved for Maldives", time: "3 hr ago" },
    { icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10", text: "New 5-star review on Patagonia trail", time: "5 hr ago" },
]

const systemHealth = [
    { label: "API Server", status: "Operational", value: 99.9, color: "emerald" },
    { label: "Database", status: "Operational", value: 98.2, color: "emerald" },
    { label: "AI Engine", status: "Degraded", value: 72.0, color: "amber" },
    { label: "CDN", status: "Operational", value: 100, color: "emerald" },
]

export default function AdminDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [search, setSearch] = useState("")
    const [notifications, setNotifications] = useState<any[]>([])

    useEffect(() => {
        const userData = localStorage.getItem("user")
        if (userData) {
            const parsed = JSON.parse(userData)
            if (parsed.role !== "admin") router.push("/")
            else setUser(parsed)
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

    const filteredUsers = mockUsers.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

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
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
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
                                    <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Admin Portal</div>
                                </div>
                            </Link>
                        </div>

                        {/* Nav */}
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {sidebarLinks.map((link) => (
                                <Link key={link.href} href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${link.active
                                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                        : "text-white/50 hover:text-white hover:bg-white/5"}`}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                    {link.active && <ChevronRight className="w-3 h-3 ml-auto" />}
                                </Link>
                            ))}
                        </nav>

                        {/* Admin Profile */}
                        <div className="p-4 border-t border-white/5">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                                    {user.name?.charAt(0) || "A"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white truncate">{user.name}</div>
                                    <div className="text-[10px] text-emerald-500 font-bold">Administrator</div>
                                </div>
                                <Link href="/login">
                                    <button className="text-white/30 hover:text-red-400 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
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
                            <input placeholder="Search anything..." className="bg-transparent text-sm text-white/70 placeholder-white/30 outline-none flex-1" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-all">
                            <Bell className="w-4 h-4" />
                            {notifications.filter(n => !n.isRead).length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full" />
                            )}
                        </button>
                        <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/60 hover:text-white transition-all">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                            {user.name?.charAt(0) || "A"}
                        </div>
                    </div>
                </header>

                <main className="p-6 space-y-6">
                    {/* Page Title */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                        <p className="text-sm text-white/40 mt-1">Welcome back, {user.name}. Here's what's happening today.</p>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {[
                            { label: "Total Users", value: "1,248", change: "+12%", up: true, icon: Users, color: "emerald" },
                            { label: "Active Trips", value: "384", change: "+8%", up: true, icon: Compass, color: "blue" },
                            { label: "Eco Certifications", value: "342", change: "+5%", up: true, icon: Shield, color: "teal" },
                            { label: "Active Alerts", value: "3", change: "-2", up: false, icon: AlertTriangle, color: "amber" },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}
                                className="rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-all"
                                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}
                            >
                                <div className={`absolute inset-0 bg-${stat.color}-500/3 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl`} />
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                                        <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                                    </div>
                                    <span className={`flex items-center gap-1 text-xs font-bold ${stat.up ? "text-emerald-400" : "text-red-400"}`}>
                                        {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                        {stat.change}
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-white/40">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Main Grid: Users Table + Activity */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Users Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="xl:col-span-2 rounded-2xl border border-white/5 overflow-hidden"
                            style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}
                        >
                            <div className="flex items-center justify-between p-5 border-b border-white/5">
                                <h2 className="font-bold text-white text-sm">Recent Users</h2>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1.5 border border-white/5">
                                        <Search className="w-3 h-3 text-white/30" />
                                        <input
                                            placeholder="Search users..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            className="bg-transparent text-xs text-white/70 placeholder-white/30 outline-none w-28"
                                        />
                                    </div>
                                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all">
                                        <UserPlus className="w-3 h-3" /> Add
                                    </button>
                                    <button className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all">
                                        <Filter className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="text-left px-5 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">User</th>
                                            <th className="text-left px-5 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider hidden sm:table-cell">Role</th>
                                            <th className="text-left px-5 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider hidden md:table-cell">Trips</th>
                                            <th className="text-left px-5 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">Status</th>
                                            <th className="text-right px-5 py-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredUsers.map((u, i) => (
                                            <motion.tr key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                                                className="hover:bg-white/3 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/70 to-teal-600/70 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                            {u.avatar}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-white">{u.name}</div>
                                                            <div className="text-xs text-white/30">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 hidden sm:table-cell">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${u.role === "Admin" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-white/60 hidden md:table-cell">{u.trips}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${u.status === "active" ? "text-emerald-400" : "text-white/30"}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : "bg-white/20"}`} />
                                                        {u.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"><Eye className="w-3.5 h-3.5" /></button>
                                                        <button className="p-1.5 rounded-lg hover:bg-blue-500/10 text-white/40 hover:text-blue-400 transition-all"><Edit className="w-3.5 h-3.5" /></button>
                                                        <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs text-white/30">Showing {filteredUsers.length} of {mockUsers.length} users</span>
                                <button className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                                    View All <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="rounded-2xl border border-white/5 p-5"
                            style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-bold text-white text-sm">Recent Activity</h2>
                                <button className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white transition-all">
                                    <MoreVertical className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {recentActivity.map((act, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                                        className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-lg ${act.bg} flex items-center justify-center shrink-0`}>
                                            <act.icon className={`w-3.5 h-3.5 ${act.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-white/70 leading-relaxed">{act.text}</p>
                                            <span className="text-[10px] text-white/30 mt-0.5 block">{act.time}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Row: System Health + Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* System Health */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="rounded-2xl border border-white/5 p-5"
                            style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-bold text-white text-sm flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-400" /> System Health
                                </h2>
                                <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">All Operational</span>
                            </div>
                            <div className="space-y-4">
                                {systemHealth.map((item, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2 text-white/70">
                                                {item.label === "API Server" && <Server className="w-3.5 h-3.5 text-white/30" />}
                                                {item.label === "Database" && <Database className="w-3.5 h-3.5 text-white/30" />}
                                                {item.label === "AI Engine" && <Zap className="w-3.5 h-3.5 text-white/30" />}
                                                {item.label === "CDN" && <Globe className="w-3.5 h-3.5 text-white/30" />}
                                                {item.label}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-${item.color}-400 font-bold`}>{item.value}%</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.color === "emerald" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                                                className={`h-full rounded-full ${item.color === "emerald" ? "bg-emerald-500" : "bg-amber-500"}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                            className="rounded-2xl border border-white/5 p-5"
                            style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.01) 100%)" }}
                        >
                            <h2 className="font-bold text-white text-sm mb-5">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: UserPlus, label: "Add User", color: "emerald", href: "/signup" },
                                    { icon: Map, label: "Add Destination", color: "blue", href: "/destinations" },
                                    { icon: Download, label: "Export Data", color: "purple", href: "#" },
                                    { icon: Bell, label: "Send Alert", color: "amber", href: "#" },
                                    { icon: Shield, label: "Eco Review", color: "teal", href: "/nature-guard" },
                                    { icon: Settings, label: "System Config", color: "slate", href: "#" },
                                ].map((action, i) => (
                                    <Link key={i} href={action.href}
                                        className={`flex items-center gap-3 p-3.5 rounded-xl border border-white/5 hover:border-${action.color}-500/30 hover:bg-${action.color}-500/5 transition-all group`}>
                                        <div className={`w-8 h-8 rounded-lg bg-${action.color}-500/10 flex items-center justify-center`}>
                                            <action.icon className={`w-4 h-4 text-${action.color}-400`} />
                                        </div>
                                        <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors">{action.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}
