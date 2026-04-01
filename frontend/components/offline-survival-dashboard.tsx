"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Download, Shield, Phone, BookOpen, MessageSquare, Wifi, WifiOff,
    MapPin, AlertTriangle, CheckCircle, ChevronDown, ChevronUp,
    Thermometer, Droplets, Mountain, Sun, Flame, Waves, Bone,
    Radio, Satellite, Smartphone, Package, RefreshCw, Globe,
    Heart, ArrowLeft, Zap, Clock, Navigation, Copy, Check,
    ShieldAlert, Users, TreeDeciduous, Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"

const API_BASE = "https://tourify-4cuu.onrender.com"

const HIDDEN_FIRST_AID_IDS = new Set(["beeswasps"])

// ─── Types ────────────────────────────────────────────────────────────────────

interface Destination {
    id: string; name: string; country: string; category: string;
    image?: string; packSizeMB: number; packVersion: string;
    languages: string[]; trailCount: number; speciesCount: number;
    emergencyContactsCount: number; firstAidGuideCount: number;
    coordinates?: { lat: number; lng: number };
}

interface OfflinePack {
    id: string; name: string; country: string; category: string;
    coordinates?: { lat: number; lng: number };
    packVersion: string; generatedAt: string; languages: string[];
    emergencyContacts: EmergencyContact[];
    firstAid: FirstAidGuide[];
    phrases: PhraseSet[];
    trailInfo: TrailInfo;
    sosConfig: SosConfig;
}

interface EmergencyContact {
    name: string; number: string; type: string; note: string;
}

interface FirstAidGuide {
    id: string; title: string; severity: string; icon: string;
    symptoms: string[]; steps: string[]; prevention: string;
}

interface PhraseSet {
    language: string;
    sections: { category: string; phrases: { text: string; phonetic: string; translation: string }[] }[];
}

interface TrailInfo {
    name: string; difficulty: string; distanceKm: number;
    elevationGainM: number; estimatedHours: number; bestSeason: string; warningZones: string[];
}

interface SosConfig {
    message: string;
    coordinates?: { lat: number; lng: number };
    channels: { name: string; description: string }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SEVERITY_STYLE: Record<string, { border: string; badge: string; dot: string; label: string }> = {
    critical: { border: "border-red-500/30", badge: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-500", label: "Critical" },
    high: { border: "border-amber-400/30", badge: "bg-amber-400/10 text-amber-400 border-amber-400/20", dot: "bg-amber-400", label: "High" },
}

const CONTACT_STYLE: Record<string, { bg: string; icon: string }> = {
    rescue: { bg: "bg-emerald-500/10 text-emerald-400", icon: "rescue" },
    police: { bg: "bg-blue-500/10 text-blue-400", icon: "police" },
    medical: { bg: "bg-red-500/10 text-red-400", icon: "medical" },
    forest: { bg: "bg-teal-500/10 text-teal-400", icon: "forest" },
    fire: { bg: "bg-orange-500/10 text-orange-400", icon: "fire" },
    disaster: { bg: "bg-purple-500/10 text-purple-400", icon: "disaster" },
}

const FIRST_AID_ICONS: Record<string, any> = {
    Mountain: Mountain, AlertTriangle: AlertTriangle, Thermometer: Thermometer,
    Droplets: Droplets, Bone: Bone, Sun: Sun, Flame: Flame, Waves: Waves,
}

function getSeverityStyle(s: string) {
    return SEVERITY_STYLE[s] || SEVERITY_STYLE.high
}

function getVisibleFirstAidGuides(guides: FirstAidGuide[]) {
    return guides.filter(g => !HIDDEN_FIRST_AID_IDS.has(g.id))
}

function getPacksFromStorage(): Record<string, OfflinePack> {
    if (typeof window === "undefined") return {}
    try {
        return JSON.parse(localStorage.getItem("tourifyy_offline_packs") || "{}")
    } catch { return {} }
}

function savePackToStorage(pack: OfflinePack) {
    const existing = getPacksFromStorage()
    existing[pack.id] = pack
    localStorage.setItem("tourifyy_offline_packs", JSON.stringify(existing))
}

function removePackFromStorage(id: string) {
    const existing = getPacksFromStorage()
    delete existing[id]
    localStorage.setItem("tourifyy_offline_packs", JSON.stringify(existing))
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBar({ isOffline, gps }: { isOffline: boolean; gps: GeolocationCoordinates | null }) {
    return (
        <div className={`flex items-center gap-4 px-4 py-2.5 rounded-xl text-xs font-medium border ${isOffline
            ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
            <div className="flex items-center gap-2">
                {isOffline
                    ? <><WifiOff className="w-4 h-4" /> <span>Offline Mode Active</span></>
                    : <><Wifi className="w-4 h-4" /> <span>Online</span></>}
            </div>
            <span className="text-foreground/20">|</span>
            <div className="flex items-center gap-2">
                <Navigation className={`w-4 h-4 ${gps ? "text-emerald-400" : "text-foreground/30"}`} />
                {gps
                    ? <span className="text-emerald-400">GPS: {gps.latitude.toFixed(4)}, {gps.longitude.toFixed(4)}</span>
                    : <span className="text-foreground/40">GPS: requesting...</span>}
            </div>
        </div>
    )
}

function FirstAidCard({ guide }: { guide: FirstAidGuide }) {
    const [open, setOpen] = useState(false)
    const style = getSeverityStyle(guide.severity)
    const Icon = FIRST_AID_ICONS[guide.icon] || AlertTriangle
    return (
        <motion.div
            layout
            className={`rounded-2xl border bg-foreground/[0.02] overflow-hidden ${style.border}`}
        >
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between p-4 hover:bg-foreground/[0.03] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${style.badge}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <div className="text-sm font-bold text-foreground">{guide.title}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border w-fit mt-0.5 ${style.badge}`}>
                            {style.label} Severity
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex gap-1 flex-wrap justify-end max-w-50">
                        {guide.symptoms.slice(0, 2).map((s, i) => (
                            <span key={i} className="text-[9px] bg-foreground/5 text-foreground/50 px-2 py-0.5 rounded-full">{s}</span>
                        ))}
                    </div>
                    {open ? <ChevronUp className="w-4 h-4 text-foreground/40 shrink-0" /> : <ChevronDown className="w-4 h-4 text-foreground/40 shrink-0" />}
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-4 border-t border-foreground/5">
                            <div className="pt-4">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-foreground/40 mb-2">Symptoms</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {guide.symptoms.map((s, i) => (
                                        <span key={i} className="text-xs bg-foreground/5 border border-foreground/10 text-foreground/70 px-2.5 py-1 rounded-full">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-[11px] font-bold uppercase tracking-wider text-foreground/40 mb-2">Steps to Take</div>
                                <ol className="space-y-2">
                                    {guide.steps.map((step, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-foreground/80">
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${style.badge}`}>
                                                {i + 1}
                                            </span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            {guide.prevention && (
                                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                                    <div className="flex items-start gap-2">
                                        <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Prevention</div>
                                            <p className="text-xs text-foreground/70">{guide.prevention}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function PhraseCard({ set }: { set: PhraseSet }) {
    const [copied, setCopied] = useState<string | null>(null)
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).catch(() => { })
        setCopied(text)
        setTimeout(() => setCopied(null), 1500)
    }
    return (
        <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] overflow-hidden">
            <div className="px-4 py-3 border-b border-foreground/5 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-sm text-foreground">{set.language}</span>
            </div>
            {set.sections.map((section, si) => (
                <div key={si} className="px-4 py-3 border-b border-foreground/5 last:border-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 mb-2">{section.category}</div>
                    <div className="space-y-2">
                        {section.phrases.map((p, pi) => (
                            <div key={pi} className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-foreground/[0.03] hover:bg-foreground/[0.05] transition-colors group">
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-foreground leading-snug">{p.text}</div>
                                    <div className="text-[11px] text-emerald-500 font-medium mt-0.5">{p.phonetic}</div>
                                    <div className="text-xs text-foreground/50 mt-0.5">{p.translation}</div>
                                </div>
                                <button
                                    onClick={() => handleCopy(p.text)}
                                    className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-foreground/30 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"
                                    title="Copy"
                                >
                                    {copied === p.text ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

function ContactCard({ contact }: { contact: EmergencyContact }) {
    const style = CONTACT_STYLE[contact.type] || CONTACT_STYLE.rescue
    const iconMap: Record<string, any> = {
        rescue: Shield, police: ShieldAlert, medical: Heart, forest: TreeDeciduous, fire: Flame, disaster: AlertTriangle
    }
    const Icon = iconMap[contact.type] || Phone
    return (
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-foreground/10 bg-foreground/[0.02] hover:border-emerald-500/20 hover:bg-foreground/[0.04] transition-all">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.bg}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground leading-none mb-0.5">{contact.name}</div>
                <div className="text-[11px] text-foreground/50">{contact.note}</div>
            </div>
            <a
                href={`tel:${contact.number}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all border border-emerald-500/20"
            >
                <Phone className="w-3 h-3" />
                {contact.number}
            </a>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OfflineSurvivalDashboard() {
    const [destinations, setDestinations] = useState<Destination[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [downloadedPacks, setDownloadedPacks] = useState<Record<string, OfflinePack>>({})
    const [downloading, setDownloading] = useState<Record<string, number>>({}) // id -> progress 0-100
    const [activePack, setActivePack] = useState<OfflinePack | null>(null)
    const [activeTab, setActiveTab] = useState<"packs" | "firstaid" | "phrases" | "contacts" | "sos">("packs")
    const [isOffline, setIsOffline] = useState(false)
    const [gps, setGps] = useState<GeolocationCoordinates | null>(null)
    const [sosSent, setSosSent] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Detect online/offline
    useEffect(() => {
        const update = () => setIsOffline(!navigator.onLine)
        update()
        window.addEventListener("online", update)
        window.addEventListener("offline", update)
        return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update) }
    }, [])

    // GPS
    useEffect(() => {
        if (!navigator.geolocation) return
        const watchId = navigator.geolocation.watchPosition(
            pos => setGps(pos.coords),
            () => { },
            { enableHighAccuracy: true, timeout: 10000 }
        )
        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    // Load downloaded packs from localStorage
    useEffect(() => {
        setDownloadedPacks(getPacksFromStorage())
    }, [])

    // Fetch destination list
    useEffect(() => {
        const fetchDestinations = async () => {
            setIsLoading(true)
            try {
                const res = await fetch(`${API_BASE}/api/offline/destinations`)
                const data = await res.json()
                setDestinations(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error("Offline destinations fetch error:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDestinations()
    }, [])

    const handleDownload = useCallback(async (dest: Destination) => {
        if (downloading[dest.id] !== undefined) return
        setDownloading(prev => ({ ...prev, [dest.id]: 0 }))

        // Simulate download progress while actual fetch happens in parallel
        let prog = 0
        const interval = setInterval(() => {
            prog += Math.random() * 18
            if (prog >= 85) { clearInterval(interval); prog = 85 }
            setDownloading(prev => ({ ...prev, [dest.id]: Math.min(Math.round(prog), 85) }))
        }, 200)

        try {
            const res = await fetch(`${API_BASE}/api/offline/pack/${dest.id}`)
            const pack: OfflinePack = await res.json()
            clearInterval(interval)
            setDownloading(prev => ({ ...prev, [dest.id]: 100 }))
            setTimeout(() => {
                savePackToStorage(pack)
                setDownloadedPacks(prev => ({ ...prev, [dest.id]: pack }))
                setDownloading(prev => { const n = { ...prev }; delete n[dest.id]; return n })
                setActivePack(pack)
                setActiveTab("firstaid")
            }, 600)
        } catch (err) {
            clearInterval(interval)
            console.error("Pack download error:", err)
            setDownloading(prev => { const n = { ...prev }; delete n[dest.id]; return n })
        }
    }, [downloading])

    const handleDeletePack = (id: string) => {
        removePackFromStorage(id)
        setDownloadedPacks(prev => { const n = { ...prev }; delete n[id]; return n })
        if (activePack?.id === id) { setActivePack(null); setActiveTab("packs") }
    }

    const handleOpenPack = (pack: OfflinePack) => {
        setActivePack(pack)
        setActiveTab("firstaid")
    }

    const handleSOS = () => {
        if (!activePack) return
        const coords = gps
            ? `${gps.latitude.toFixed(5)}, ${gps.longitude.toFixed(5)}`
            : activePack.coordinates
                ? `${activePack.coordinates.lat}, ${activePack.coordinates.lng}`
                : "Unknown"

        const msg = `${activePack.sosConfig.message} GPS: ${coords}`

        // Try native share first, fall back to SMS
        if (navigator.share) {
            navigator.share({ title: "SOS Emergency", text: msg }).catch(() => { })
        } else {
            window.open(`sms:?body=${encodeURIComponent(msg)}`, "_blank")
        }

        // Also open maps with coordinates
        if (gps) {
            window.open(`https://maps.google.com?q=${gps.latitude},${gps.longitude}`, "_blank")
        }

        setSosSent(true)
        setTimeout(() => setSosSent(false), 5000)
    }

    const TABS = [
        { id: "packs", label: "Packs", icon: Package },
        { id: "firstaid", label: "First Aid", icon: Heart },
        { id: "phrases", label: "Phrases", icon: MessageSquare },
        { id: "contacts", label: "Contacts", icon: Phone },
        { id: "sos", label: "SOS", icon: Radio },
    ] as const

    const filteredDestinations = destinations.filter(d =>
        !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.country.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const firstAidGuidesStat = destinations.reduce((max, d) => Math.max(max, d.firstAidGuideCount || 0), 0)

    const downloadedList = Object.values(downloadedPacks)

    // ─── Loading ─────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Shield className="w-12 h-12 text-emerald-500" />
                </motion.div>
                <p className="text-muted-foreground text-sm font-medium">Loading survival packs...</p>
            </div>
        )
    }

    // ─── Main Render ─────────────────────────────────────────────────────────
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                            <Radio className="w-3.5 h-3.5" />
                            Offline Survival Mode
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                            Your Wilderness
                            <br />
                            <span className="bg-linear-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">Safety Kit</span>
                        </h1>
                        <p className="text-muted-foreground text-base mt-3 max-w-xl">
                            Download per-destination survival packs — works 100% offline. Cached maps, first-aid guides, phrase books, emergency contacts, and SOS beacon.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 items-start sm:items-end">
                        <StatusBar isOffline={isOffline} gps={gps} />
                        {downloadedList.length > 0 && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                                <CheckCircle className="w-3.5 h-3.5" />
                                {downloadedList.length} pack{downloadedList.length > 1 ? "s" : ""} ready offline
                            </div>
                        )}
                    </div>
                </div>

                {/* Offline banner */}
                <AnimatePresence>
                    {isOffline && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-4">
                                <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />
                                <div>
                                    <div className="text-sm font-bold text-amber-300">No Internet Connection</div>
                                    <div className="text-xs text-amber-400/70">Offline Survival Mode is active. All downloaded packs are available below.</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick-stats strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { icon: Package, label: "Packs Available", value: destinations.length, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                        { icon: Download, label: "Downloaded", value: downloadedList.length, color: "text-teal-400", bg: "bg-teal-500/10" },
                        { icon: Heart, label: "First Aid Guides", value: firstAidGuidesStat, color: "text-red-400", bg: "bg-red-500/10" },
                        { icon: Globe, label: "Languages", value: "10+", color: "text-blue-400", bg: "bg-blue-500/10" },
                    ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                            className="p-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <div>
                                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                                <div className="text-[10px] text-foreground/40 font-medium">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Tab Nav + Active Pack Sub-nav */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.06] overflow-x-auto">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            disabled={tab.id !== "packs" && !activePack}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
                                ${activeTab === tab.id
                                    ? tab.id === "sos"
                                        ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                                        : "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                                    : "text-foreground/50 hover:text-foreground/80 disabled:opacity-30 disabled:cursor-not-allowed"}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activePack && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                        <Package className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-300 font-semibold">{activePack.name}</span>
                        <span className="text-amber-400/50">{activePack.country}</span>
                        <button onClick={() => { setActivePack(null); setActiveTab("packs") }}
                            className="ml-1 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center hover:bg-amber-500/40 transition-colors text-amber-400">
                            ×
                        </button>
                    </div>
                )}
            </div>

            {/* ── PACKS TAB ─────────────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {activeTab === "packs" && (
                    <motion.div key="packs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

                        {/* Downloaded Packs */}
                        {downloadedList.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <h2 className="font-bold text-foreground text-sm">Downloaded & Ready Offline</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {downloadedList.map(pack => (
                                        <motion.div key={pack.id} layout
                                            className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/3 relative overflow-hidden">
                                            <div className="absolute top-2 right-2">
                                                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                                    Offline Ready
                                                </span>
                                            </div>
                                            <div className="mb-3">
                                                <div className="font-bold text-foreground text-sm leading-tight">{pack.name}</div>
                                                <div className="text-xs text-muted-foreground">{pack.country}</div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                                                {[
                                                    { label: "Guides", value: getVisibleFirstAidGuides(pack.firstAid).length, color: "text-red-400" },
                                                    { label: "Contacts", value: pack.emergencyContacts.length, color: "text-blue-400" },
                                                    { label: "Languages", value: pack.phrases.length, color: "text-teal-400" },
                                                ].map((s, i) => (
                                                    <div key={i} className="p-2 rounded-xl bg-foreground/[0.03]">
                                                        <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                                                        <div className="text-[9px] text-foreground/40">{s.label}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button onClick={() => handleOpenPack(pack)} size="sm"
                                                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
                                                    Open Pack
                                                </Button>
                                                <button onClick={() => handleDeletePack(pack.id)}
                                                    className="px-3 rounded-xl border border-foreground/10 text-foreground/40 hover:text-red-400 hover:border-red-500/30 text-xs transition-all">
                                                    Delete
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Browse all */}
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <h2 className="font-bold text-foreground text-sm flex items-center gap-2">
                                <Globe className="w-4 h-4 text-foreground/40" />
                                All Destinations ({filteredDestinations.length})
                            </h2>
                            <input
                                type="text"
                                placeholder="Search destination..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="px-3 py-1.5 rounded-xl border border-foreground/10 bg-foreground/[0.03] text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-500/50 w-48"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDestinations.map((dest, i) => {
                                const isDownloaded = !!downloadedPacks[dest.id]
                                const dlProgress = downloading[dest.id]
                                const isDownloading = dlProgress !== undefined

                                return (
                                    <motion.div key={dest.id} layout
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                        className={`p-4 rounded-2xl border transition-all ${isDownloaded ? "border-emerald-500/20 bg-emerald-500/2" : "border-foreground/10 bg-foreground/[0.02] hover:border-foreground/20"}`}>

                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="font-bold text-sm text-foreground leading-tight">{dest.name}</div>
                                                <div className="text-xs text-muted-foreground">{dest.country}</div>
                                            </div>
                                            <span className="text-[9px] bg-foreground/5 text-foreground/40 border border-foreground/10 px-2 py-0.5 rounded-full font-medium shrink-0">
                                                {dest.category}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-1.5 mb-3 text-xs text-foreground/50">
                                            <div className="flex items-center gap-1.5"><Heart className="w-3 h-3 text-red-400" />{dest.firstAidGuideCount} first-aid guides</div>
                                            <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-blue-400" />{dest.emergencyContactsCount} contacts</div>
                                            <div className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-teal-400" />{dest.languages.slice(0, 2).join(", ")}</div>
                                            <div className="flex items-center gap-1.5"><Package className="w-3 h-3 text-amber-400" />~{dest.packSizeMB} MB</div>
                                        </div>

                                        {isDownloading && (
                                            <div className="mb-3">
                                                <div className="flex justify-between text-[10px] mb-1 text-foreground/50">
                                                    <span>Downloading pack...</span>
                                                    <span>{dlProgress}%</span>
                                                </div>
                                                <div className="w-full h-1.5 rounded-full bg-foreground/10">
                                                    <motion.div
                                                        className="h-full rounded-full bg-emerald-500"
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: `${dlProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {isDownloaded ? (
                                            <Button onClick={() => handleOpenPack(downloadedPacks[dest.id])} size="sm"
                                                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
                                                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />Open Pack
                                            </Button>
                                        ) : (
                                            <Button onClick={() => handleDownload(dest)} size="sm" disabled={isDownloading}
                                                className="w-full rounded-xl bg-foreground/[0.06] hover:bg-emerald-600 hover:text-white text-foreground/70 text-xs border border-foreground/10 transition-all">
                                                {isDownloading
                                                    ? <><RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />Downloading...</>
                                                    : <><Download className="w-3.5 h-3.5 mr-1.5" />Download Pack</>}
                                            </Button>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}

                {/* ── FIRST AID TAB ──────────────────────────────────────────────── */}
                {activeTab === "firstaid" && activePack && (
                    <motion.div key="firstaid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/15 mb-6">
                            <Heart className="w-5 h-5 text-red-400 shrink-0" />
                            <div>
                                <div className="font-bold text-sm text-foreground">Emergency First Aid — {activePack.name}</div>
                                <div className="text-xs text-foreground/50">Tap any condition to expand full treatment steps. Works offline.</div>
                            </div>
                        </div>

                        {/* Trail Warnings */}
                        <div className="mb-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                <div className="font-bold text-sm text-amber-300">Trail Safety Warnings</div>
                            </div>
                            <ul className="space-y-1.5">
                                {activePack.trailInfo.warningZones.map((w, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Trail Info */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                            {[
                                { label: "Distance", value: `${activePack.trailInfo.distanceKm} km`, icon: MapPin, color: "text-emerald-400" },
                                { label: "Elevation", value: `+${activePack.trailInfo.elevationGainM}m`, icon: Mountain, color: "text-blue-400" },
                                { label: "Est. Time", value: `${activePack.trailInfo.estimatedHours}h`, icon: Clock, color: "text-teal-400" },
                                { label: "Difficulty", value: activePack.trailInfo.difficulty, icon: Activity, color: "text-amber-400" },
                            ].map((s, i) => (
                                <div key={i} className="p-3 rounded-xl border border-foreground/10 bg-foreground/[0.02] flex items-center gap-2">
                                    <s.icon className={`w-4 h-4 shrink-0 ${s.color}`} />
                                    <div>
                                        <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
                                        <div className="text-[10px] text-foreground/40">{s.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3">
                            {getVisibleFirstAidGuides(activePack.firstAid).map(guide => (
                                <FirstAidCard key={guide.id} guide={guide} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── PHRASES TAB ────────────────────────────────────────────────── */}
                {activeTab === "phrases" && activePack && (
                    <motion.div key="phrases" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 mb-6">
                            <MessageSquare className="w-5 h-5 text-blue-400 shrink-0" />
                            <div>
                                <div className="font-bold text-sm text-foreground">Survival Phrase Book — {activePack.name}</div>
                                <div className="text-xs text-foreground/50">Tap the copy icon to copy any phrase. Includes phonetic pronunciation.</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {activePack.phrases.map((set, i) => (
                                <PhraseCard key={i} set={set} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── CONTACTS TAB ───────────────────────────────────────────────── */}
                {activeTab === "contacts" && activePack && (
                    <motion.div key="contacts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 mb-6">
                            <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                            <div>
                                <div className="font-bold text-sm text-foreground">Emergency Contacts — {activePack.country}</div>
                                <div className="text-xs text-foreground/50">Tap a number to call. Cached locally — works without internet.</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {activePack.emergencyContacts.map((c, i) => (
                                <ContactCard key={i} contact={c} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── SOS TAB ────────────────────────────────────────────────────── */}
                {activeTab === "sos" && activePack && (
                    <motion.div key="sos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>

                        {/* Big SOS Button */}
                        <div className="flex flex-col items-center text-center mb-10">
                            <motion.button
                                onClick={handleSOS}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="relative w-44 h-44 rounded-full bg-linear-to-br from-red-600 to-red-800 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.5)] border-4 border-red-400/30 cursor-pointer transition-all hover:shadow-[0_0_80px_rgba(239,68,68,0.7)]"
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ repeat: Infinity, duration: 2.5 }}
                                    className="absolute inset-0 rounded-full bg-red-500/20 border-2 border-red-500/30"
                                />
                                <Radio className="w-10 h-10 text-white mb-1" />
                                <span className="text-2xl font-black text-white tracking-widest">SOS</span>
                                <span className="text-[10px] text-red-200/80 font-medium mt-0.5">TAP TO SEND</span>
                            </motion.button>

                            <AnimatePresence>
                                {sosSent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        SOS signal dispatched!
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-4 text-xs text-foreground/40 max-w-xs">
                                Sends your GPS coordinates + emergency message via SMS, native share, and opens your location in Google Maps.
                            </div>
                        </div>

                        {/* GPS Location */}
                        <div className="p-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Navigation className="w-4 h-4 text-emerald-500" />
                                <div className="font-bold text-sm text-foreground">Your Current Location</div>
                            </div>
                            {gps ? (
                                <div className="space-y-1.5 text-sm text-foreground/70">
                                    <div className="font-mono text-emerald-400 text-base">{gps.latitude.toFixed(6)}, {gps.longitude.toFixed(6)}</div>
                                    <div className="text-xs text-foreground/40">Accuracy: ±{Math.round(gps.accuracy)}m · Altitude: {gps.altitude ? `${Math.round(gps.altitude)}m` : "N/A"}</div>
                                    <a
                                        href={`https://maps.google.com?q=${gps.latitude},${gps.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
                                    >
                                        <MapPin className="w-3 h-3" />View on Google Maps (share this link with rescuers)
                                    </a>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-foreground/40 text-sm">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Acquiring GPS signal...
                                </div>
                            )}
                        </div>

                        {/* SOS Message preview */}
                        <div className="p-4 rounded-2xl border border-red-500/15 bg-red-500/3 mb-4">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-foreground/40 mb-2">SOS Message Preview</div>
                            <p className="text-sm text-foreground/80 font-mono leading-relaxed">
                                {activePack.sosConfig.message}
                                {gps && ` GPS: ${gps.latitude.toFixed(5)}, ${gps.longitude.toFixed(5)}`}
                            </p>
                        </div>

                        {/* Channels */}
                        <div className="space-y-3">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-foreground/40 mb-2">Available Signal Channels</div>
                            {activePack.sosConfig.channels.map((ch, i) => {
                                const icons = [Smartphone, Satellite, Radio]
                                const Icon = icons[i] || Radio
                                return (
                                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border border-foreground/10 bg-foreground/[0.02]">
                                        <div className="w-9 h-9 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                                            <Icon className="w-4 h-4 text-foreground/50" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-foreground">{ch.name}</div>
                                            <div className="text-xs text-foreground/50 mt-0.5">{ch.description}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Quick-dial from top contact */}
                        {activePack.emergencyContacts[0] && (
                            <div className="mt-6">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-foreground/40 mb-3">Quick-Dial Emergency</div>
                                <a href={`tel:${activePack.emergencyContacts[0].number}`}
                                    className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 transition-all">
                                    <Phone className="w-5 h-5 text-red-400" />
                                    <div>
                                        <div className="font-bold text-foreground text-sm">{activePack.emergencyContacts[0].name}</div>
                                        <div className="text-red-400 font-mono text-base font-bold">{activePack.emergencyContacts[0].number}</div>
                                    </div>
                                </a>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
