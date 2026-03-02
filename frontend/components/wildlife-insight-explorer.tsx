"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Bird, Leaf, Search, Eye, AlertTriangle, ShieldCheck,
    MapPin, Clock, Sparkles, ChevronRight, X, Star, TreeDeciduous, Fish, Rabbit
} from "lucide-react"

const SPECIES_ICONS: { [key: string]: any } = {
    Mammal: Rabbit,
    Bird: Bird,
    Primate: Bird,
    Marine: Fish,
    Tree: TreeDeciduous,
    Flower: Leaf,
    Default: Leaf,
}

const STATUS_STYLE: { [key: string]: { border: string; badge: string; dot: string } } = {
    "Least Concern": { border: "border-emerald-500/30", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
    "Near Threatened": { border: "border-amber-400/30", badge: "bg-amber-400/10 text-amber-400 border-amber-400/20", dot: "bg-amber-400" },
    "Vulnerable": { border: "border-orange-500/30", badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", dot: "bg-orange-500" },
    "Endangered": { border: "border-red-500/30", badge: "bg-red-500/10 text-red-400 border-red-500/20", dot: "bg-red-500" },
    "Critically Endangered": { border: "border-red-700/40", badge: "bg-red-700/10 text-red-400 border-red-700/20", dot: "bg-red-600" },
}

function getStatus(s: string) {
    return STATUS_STYLE[s] || STATUS_STYLE["Least Concern"]
}

export function WildlifeInsightExplorer() {
    const [wildlife, setWildlife] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [selected, setSelected] = useState<any>(null)
    const [filter, setFilter] = useState({ type: "All", species: "All", status: "all", q: "" })
    const [sighted, setSighted] = useState<Set<string>>(new Set())
    const searchRef = useRef<HTMLInputElement>(null)

    const fetchWildlife = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (filter.type !== "All") params.set("type", filter.type)
            if (filter.species !== "All") params.set("species", filter.species)
            if (filter.status === "endangered") params.set("status", "endangered")
            if (filter.q) params.set("q", filter.q)
            const [wRes, sRes] = await Promise.all([
                fetch(`https://tourify-backend-99ef.onrender.com/api/wildlife?${params}`),
                fetch(`https://tourify-backend-99ef.onrender.com/api/wildlife/stats`),
            ])
            const [wData, sData] = await Promise.all([wRes.json(), sRes.json()])
            setWildlife(wData)
            setStats(sData)
            if (!selected && wData.length > 0) setSelected(wData[0])
        } catch (err) {
            console.error("Wildlife fetch error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => { fetchWildlife() }, [filter.type, filter.species, filter.status])

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchWildlife() }

    const handleSight = async (id: string) => {
        if (sighted.has(id)) return
        try {
            const res = await fetch(`https://tourify-backend-99ef.onrender.com/api/wildlife/${id}/sight`, { method: "PUT" })
            const data = await res.json()
            setWildlife(prev => prev.map(w => w._id === id ? { ...w, sightings: data.sightings } : w))
            if (selected?._id === id) setSelected((prev: any) => ({ ...prev, sightings: data.sightings }))
            setSighted(prev => new Set(prev).add(id))
        } catch (err) { console.error(err) }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* ── Header ── */}
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">AI Vision Enabled</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3">
                    Wildlife{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Insight</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Identify flora and fauna along your route with our integrated AI vision. Log sightings, explore endangered species, and deepen your connection to the wild.
                </p>

                {/* Stats pills */}
                {stats && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-4 mt-6">
                        {[
                            { label: "Total Species", value: stats.total, icon: Bird, color: "text-emerald-500" },
                            { label: "Flora Catalogued", value: stats.flora, icon: Leaf, color: "text-teal-400" },
                            { label: "Fauna Tracked", value: stats.fauna, icon: Rabbit, color: "text-amber-400" },
                            { label: "Endangered", value: stats.endangered, icon: AlertTriangle, color: "text-red-400" },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                                <Icon className={`w-4 h-4 ${color}`} />
                                <span className="text-xl font-bold text-foreground">{value}</span>
                                <span className="text-xs text-muted-foreground">{label}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* ── Search & Filters ── */}
            <div className="flex flex-col md:flex-row gap-3 mb-8">
                <form onSubmit={handleSearch} className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input ref={searchRef} value={filter.q}
                        onChange={e => setFilter(f => ({ ...f, q: e.target.value }))}
                        onKeyDown={e => e.key === "Enter" && fetchWildlife()}
                        placeholder="Search species, habitat, or region..."
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40 transition-colors"
                    />
                </form>

                {/* Type */}
                <div className="flex gap-2">
                    {["All", "Fauna", "Flora"].map(t => (
                        <button key={t} onClick={() => setFilter(f => ({ ...f, type: t }))}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${filter.type === t ? "bg-emerald-500 text-white border-emerald-500" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}`}>
                            {t}
                        </button>
                    ))}
                </div>

                {/* Endangered */}
                <button onClick={() => setFilter(f => ({ ...f, status: f.status === "endangered" ? "all" : "endangered" }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${filter.status === "endangered" ? "bg-red-500 text-white border-red-500" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}`}>
                    <AlertTriangle className="w-3.5 h-3.5" /> Endangered Only
                </button>
            </div>

            {/* Species chips */}
            <div className="flex flex-wrap gap-2 mb-8">
                {["All", "Mammal", "Bird", "Marine", "Primate", "Tree", "Flower"].map(sp => (
                    <button key={sp} onClick={() => setFilter(f => ({ ...f, species: sp }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${filter.species === sp ? "bg-teal-500 text-white border-teal-500" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}`}>
                        {sp}
                    </button>
                ))}
            </div>

            {/* ── Main Layout: List + Detail Panel ── */}
            <div className="grid lg:grid-cols-[1fr_420px] gap-8">

                {/* LEFT: Wildlife Grid */}
                <div>
                    {isLoading ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10 animate-pulse">
                                    <div className="h-44 bg-white/5" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-4 bg-white/5 rounded-full w-2/3" />
                                        <div className="h-3 bg-white/5 rounded-full w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : wildlife.length === 0 ? (
                        <div className="py-24 text-center">
                            <Bird className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                            <p className="text-muted-foreground">No species found. Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <motion.div className="grid sm:grid-cols-2 gap-4" layout>
                            <AnimatePresence mode="popLayout">
                                {wildlife.map((w, index) => {
                                    const st = getStatus(w.conservationStatus)
                                    const SpeciesIcon = SPECIES_ICONS[w.species] || SPECIES_ICONS.Default
                                    const isSelected = selected?._id === w._id
                                    return (
                                        <motion.div key={w._id} layout
                                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: index * 0.05 }}
                                            onClick={() => setSelected(w)}
                                            className={`cursor-pointer group rounded-3xl overflow-hidden border transition-all duration-300 ${isSelected ? `${st.border} shadow-xl` : "border-white/10 hover:border-white/20"} bg-white/[0.03]`}
                                        >
                                            {/* Image */}
                                            <div className="relative h-44 overflow-hidden">
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                    style={{ backgroundImage: `url(${w.image})` }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                                                {/* Endangered banner */}
                                                {w.isEndangered && (
                                                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/80 backdrop-blur-sm">
                                                        <AlertTriangle className="w-2.5 h-2.5 text-white" />
                                                        <span className="text-[10px] font-bold text-white">Protected</span>
                                                    </div>
                                                )}
                                                {/* Type badge */}
                                                <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-sm border ${w.type === "Flora" ? "bg-teal-500/20 border-teal-500/30 text-teal-300" : "bg-amber-500/20 border-amber-500/30 text-amber-300"}`}>
                                                    <SpeciesIcon className="w-3 h-3" />
                                                    <span className="text-[10px] font-semibold">{w.type}</span>
                                                </div>
                                                {/* Sightings */}
                                                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                                                    <Eye className="w-3 h-3 text-white/70" />
                                                    <span className="text-[10px] font-semibold text-white/80">{w.sightings.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="p-4">
                                                <div className="flex items-start justify-between mb-1.5">
                                                    <div>
                                                        <h3 className="font-bold text-foreground text-sm">{w.name}</h3>
                                                        <p className="text-[11px] text-muted-foreground italic">{w.scientificName}</p>
                                                    </div>
                                                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.badge}`}>
                                                        {w.conservationStatus}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                                                    <p className="text-[11px] text-muted-foreground truncate">{w.foundIn.slice(0, 2).join(", ")}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>

                {/* RIGHT: Detail Panel */}
                <AnimatePresence mode="wait">
                    {selected && (
                        <motion.div key={selected._id}
                            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="sticky top-28 self-start space-y-4"
                        >
                            {/* Hero Image */}
                            <div className="relative h-56 rounded-3xl overflow-hidden group">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${selected.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-2xl font-black text-white">{selected.name}</p>
                                    <p className="text-sm text-white/60 italic">{selected.scientificName}</p>
                                </div>
                                {selected.isEndangered && (
                                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/80 backdrop-blur-sm">
                                        <AlertTriangle className="w-3 h-3 text-white" />
                                        <span className="text-xs font-bold text-white">IUCN Protected</span>
                                    </div>
                                )}
                            </div>

                            {/* Conservation Status */}
                            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${getStatus(selected.conservationStatus).border} bg-white/[0.02]`}>
                                <div className={`w-2.5 h-2.5 rounded-full ${getStatus(selected.conservationStatus).dot} animate-pulse shrink-0`} />
                                <div>
                                    <p className="text-xs text-muted-foreground">Conservation Status</p>
                                    <p className={`text-sm font-bold ${getStatus(selected.conservationStatus).badge.includes("emerald") ? "text-emerald-400" : getStatus(selected.conservationStatus).badge.includes("amber") ? "text-amber-400" : "text-red-400"}`}>
                                        {selected.conservationStatus}
                                    </p>
                                </div>
                                <ShieldCheck className="ml-auto w-5 h-5 text-muted-foreground/40" />
                            </div>

                            {/* Description */}
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                                <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>
                            </div>

                            {/* Fun Fact */}
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4 text-emerald-500" />
                                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">AI Insight</p>
                                </div>
                                <p className="text-sm text-foreground/80 leading-relaxed italic">"{selected.funFact}"</p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Best Spotting</p>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        <p className="text-xs font-bold text-foreground">{selected.bestSpottingTime}</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Species Group</p>
                                    <div className="flex items-center gap-1.5">
                                        <Bird className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                        <p className="text-xs font-bold text-foreground">{selected.species}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Habitat tags */}
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2.5">Habitat</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {selected.habitat.map((h: string) => (
                                        <span key={h} className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-400 font-semibold">
                                            {h}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Found in */}
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2.5">Found In</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {selected.foundIn.map((loc: string) => (
                                        <span key={loc} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-foreground/70">
                                            <MapPin className="w-2.5 h-2.5" /> {loc}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Log Sighting CTA */}
                            <button
                                onClick={() => handleSight(selected._id)}
                                disabled={sighted.has(selected._id)}
                                className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${sighted.has(selected._id)
                                    ? "bg-white/5 border border-white/10 text-muted-foreground cursor-not-allowed"
                                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02]"
                                    }`}
                            >
                                {sighted.has(selected._id) ? (
                                    <><ShieldCheck className="w-4 h-4" /> Sighting Logged!</>
                                ) : (
                                    <><Eye className="w-4 h-4" /> Log My Sighting ({selected.sightings.toLocaleString()} total)</>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
